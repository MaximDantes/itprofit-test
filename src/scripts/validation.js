export const regexes = {
    email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    name: /^[a-zа-я ,.'-]+$/i,
    phone: new RegExp(
        '^\\+375 \\((17|29|33|44)\\) [0-9]{3}-[0-9]{2}-[0-9]{2}$'
    ),
}

export const validators = {
    name(value) {
        let error = ''

        if (value.length < 3) {
            error = 'Name length must be longer then 3'
        }

        if (!value.match(regexes.name)) {
            error = 'Name is invalid'
        }

        if (!value) {
            error = 'Name is required'
        }

        return error
    },

    email(value) {
        let error = ''

        if (!value.match(regexes.email)) {
            error = 'Email is invalid'
        }

        if (!value) {
            error = 'Email is required'
        }

        return error
    },

    message(value) {
        let error = ''

        if (value.length < 20) {
            error = 'Message if too short'
        }

        if (!value) {
            error = 'Message is required'
        }

        return error
    },

    phone(value) {
        let error = ''

        if (!value?.match(regexes.phone)) {
            error = 'Phone is invalid'
        }

        if (!value) {
            error = 'Phone is required'
        }

        return error
    },

    password(value) {
        let error = ''

        if (value.length < 6) {
            error = 'Password is too short'
        }

        return error
    },
}
