export default {
  methods: {
    validation (password) {
      if (password.length < 10) {
        return 'Passwords should ideally be at least 10 characters'
      } else {
        let lowercaseCount = 0
        let uppercaseCount = 0
        let numberCount = 0
        let specialCount = 0
        for (let i = password.length - 1; i >= 0; i--) {
          const element = password[i]
          if (isNaN(element)) {
            if (element.toLowerCase() === element.toUpperCase()) {
              specialCount++
            } else if (element === element.toUpperCase()) {
              uppercaseCount++
            } else if (element === element.toLowerCase()) {
              lowercaseCount++
            }
          } else {
            numberCount++
          }
        }
        if (uppercaseCount < 1) {
          return 'Passwords should have at least 1 uppercase character (A-Z).'
        }
        if (lowercaseCount < 1) {
          return 'Passwords should have at least 1 lowercase character (a-z).'
        }
        if (numberCount < 1) {
          return 'Passwords should have at least 1 digit (0-9).'
        }
        if (specialCount < 1) {
          return 'Passwords should have at least 1 special character (punctuation).'
        }
        return true
      }
    }
  }
}
