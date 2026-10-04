// define monkey patch function
const monkeyPatch = () => {
    // should be sent only once
    let prevHeaders = {}
    let trigger = null

    let oldXHRSend = window.XMLHttpRequest.prototype.setRequestHeader
    window.XMLHttpRequest.prototype.setRequestHeader = function (
        k,
        val,
        ...args
    ) {
        let key = k.toLowerCase()
        if (
            ['authorization', 'x-csrf-token', 
                'x-client-transaction-id', 'x-client-uuid',
                'x-guest-token', 'x-twitter-auth-type', 
                'x-twitter-client-language',
                'x-client-uuid', 'x-twitter-active-user', 
                
            ].includes(key) &&
            !(prevHeaders[key] == val)
        ) {
            prevHeaders[key] = val
            if (trigger) {
                clearTimeout(trigger)
            }
            trigger = setTimeout(() => {
                trigger = null
                
                // Dispatch event with any headers we have (don't wait for all)
                window.dispatchEvent(
                    new CustomEvent('updateHeaders', {
                        detail: {
                            authorization: prevHeaders['authorization'] || undefined,
                            csrfToken: prevHeaders['x-csrf-token'] || undefined,
                            authType: prevHeaders['x-twitter-auth-type'] || undefined,
                            clientLanguage: prevHeaders['x-twitter-client-language'] || undefined,
                            activeUser: prevHeaders['x-twitter-active-user'] || undefined,
                            clientTransactionId: prevHeaders['x-client-transaction-id'] || undefined,
                            clientUuid: prevHeaders['x-client-uuid'] || undefined,
                            guestToken: prevHeaders['x-guest-token'] || undefined,
                        },
                    })
                )
            }, 20)
        }
        return oldXHRSend.apply(this, [k, val, ...args])
    }
}

monkeyPatch()