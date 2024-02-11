import { api } from './api.js'
import { regexes, validators } from './validation.js'
import IMask from 'imask'

const form = document.querySelector('.form')
const modal = document.querySelector('.modal')
const modalMessage = document.querySelector('.modal__message')
const showModalButton = document.querySelector('.button--show-modal')
const registrationButton = document.querySelector('.button--registration')
const registrationForm = document.querySelector('.modal__registration')

const showModal = (text, isError = false, isRegistration = false) => {
    if (isRegistration) {
        modal.classList.add('modal--registration')
    } else {
        modal.classList.remove('modal--registration')
    }

    if (isError) {
        modal.classList.add('modal--error')
    } else {
        modal.classList.remove('modal--error')
    }

    modalMessage.textContent = text
    modal.classList.remove('modal--closed')
    modal.classList.add('modal--open')
}

const hideModal = () => {
    modal.classList.remove('modal--open')
    modal.classList.add('modal--closed')
    modal.classList.remove('modal--error')
    modal.classList.remove('modal--registration')
}

const inputs = [
    {
        name: 'name',
        element: document.querySelector('.form__name'),
        validate(value) {
            return validators.name(value)
        },
        mask: regexes.name,
        role: 'form',
    },
    {
        name: 'email',
        element: document.querySelector('.form__email'),
        validate(value) {
            return validators.email(value)
        },
        role: 'form',
    },
    {
        name: 'phone',
        element: document.querySelector('.form__phone'),
        validate(value) {
            return validators.phone(value)
        },
        mask: '+{375} (00) 000-00-00',
        role: 'form',
    },
    {
        name: 'message',
        element: document.querySelector('.form__message'),
        validate(value) {
            return validators.message(value)
        },
        role: 'form',
    },
    {
        name: 'registration-email',
        element: document.querySelector('.registration__email'),
        validate(value) {
            return validators.email(value)
        },
        role: 'registration',
    },
    {
        name: 'registration-password',
        element: document.querySelector('.registration__password'),
        validate(value) {
            return validators.password(value)
        },
        role: 'registration',
    },
]

inputs.map((item) => {
    const inputElement = item.element.querySelector('.input__field')
    const errorElement = item.element.querySelector('.input__error')

    const showError = () => {
        const error = item.validate(item.getValue())

        if (!error) {
            errorElement.textContent = error
            item.element.classList.remove('input--error')
            return
        }
        if (!item.isTouched) return

        errorElement.textContent = error
        item.element.classList.add('input--error')
    }

    inputElement.addEventListener('focusout', () => {
        item.isTouched = true
        showError()
    })
    inputElement.addEventListener('input', (e) => {
        if (item.maskedInput) {
            item.maskedInput.value = e.currentTarget.value
        }
        showError()
    })

    form.addEventListener('submit', () => {
        item.isTouched = true
        showError()
    })

    if (item.mask) {
        item.maskedInput = IMask(inputElement, { mask: item.mask })
    }

    item.clear = () => {
        inputElement.value = ''
        errorElement.textContent = ''
        item.element.classList.remove('input--error')
    }

    item.getValue = () => {
        return item.maskedInput?.value || inputElement.value
    }

    item.showServerError = (error) => {
        errorElement.textContent = error
        item.element.classList.add('input--error')
    }
})

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    let isError = false

    const formData = {}
    inputs.map((item) => {
        if (item.role !== 'form') return

        formData[item.name] = item.getValue()
        if (item.validate(item.getValue())) {
            isError = true
        }
    })

    if (isError) return

    const response = await api.sendMessage(formData)

    if (response.status === 'error' && response.fields) {
        for (let key in response.fields) {
            inputs
                .find((input) => key === input.name)
                ?.showServerError(response.fields[key])
        }
        return
    }

    if (response.status === 'error') {
        showModal(response.message, true)
        return
    }

    inputs.map((item) => item.role === 'form' && item.clear())
    showModal(response.message)
})

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        hideModal()
    }
})

window.addEventListener('load', async () => {
    const response = await api.ping()

    if (response?.status === 'error') {
        showModal(response.message, true)
    }
})

showModalButton.addEventListener('click', () => {
    showModal('This is modal with some message')
})

registrationButton.addEventListener('click', () => {
    showModal('', false, true)
})

registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    let isError = false

    const formData = {}
    inputs.map((item) => {
        if (item.role !== 'registration') return

        formData[item.name] = item.getValue()
        if (item.validate(item.getValue())) {
            isError = true
        }
    })

    if (isError) return

    const response = await api.registration(formData)

    if (response.status === 'error') {
        showModal(response.message, true)
        return
    }

    inputs.map((item) => item.role === 'registration' && item.clear())
    showModal(response.message)
})
