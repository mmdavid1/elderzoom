import { SignUp } from '@clerk/nextjs'

const SignupPage = () => {
  return (
    <main className='flex h-screen w-full justify-center items-center'>
        <SignUp />
    </main>
  )
}

export default SignupPage