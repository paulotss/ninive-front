import SignInForm from './SignInForm'

const SignIn = () => {
  return (
    <>
      <div className="mb-8">
        <h3 className="mb-1">Bem vindo!</h3>
        <p>Por favor, entre com seus dados para entrar!</p>
      </div>
      <SignInForm disableSubmit={false} />
    </>
  )
}

export default SignIn
