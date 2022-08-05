(() => {
  const { createApp } = Vue
  createApp({
    data() {
      return {
        loading: false,
        newForm: {
          name: '',
          captcha: false
        },
        forms: []
      }
    },
    async mounted() {
      await this.getForms()
    },
    methods: {
      parseCaptcha(value) {
        return value ? 'Sim' : 'Não'
      },
      parseDatetime(time) {
        return new Date(time).toLocaleDateString()
      },
      async getForms() {
        try {
          this.loading = true
          const response = await fetch('/api/form').then(r => r.json())
          Object.assign(this.forms, response) 
        } catch (error) {
          alert("Erro")
        } finally {
          this.loading = false
        }
      },
      async saveForm(event) {
        event.preventDefault()
        if(this.newForm.name && this.newForm.email) {
          try {
            this.loading = true
            let payload = {
              name: this.newForm.name, 
              email: this.newForm.email,
              captcha: this.newForm.captcha
            }
            const result = await fetch('/api/form', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            }).then(r => r.json())
            payload._id = result.insertedId
            payload.date = Date.now()
            this.forms.push(payload)
            this.clearInputs()
          } catch (error) {
            alert('Erro')
          } finally {
            this.loading = false
          }
        }
      },
      clearInputs() {
        this.newForm.name = ''
        this.newForm.captcha = false
        this.newForm.email = ''
      },
      deleteForm(id) {  
        try {  
          fetch(`/api/form/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          this.forms = this.forms.filter(f => f._id !== id)
        } catch (error) {
          alert('Erro')
        }
      }
    }  
  }).mount('#app')
})()