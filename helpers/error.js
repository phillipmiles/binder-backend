
throwError = (code, errorMessage) => error => {
    if (!error) error = new Error(errorMessage || 'Default Error')
    error.status = 'error'
    error.code = code
    throw error
}