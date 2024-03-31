import { SignIn } from '@clerk/nextjs'

const SigninPage = () => {
  return (
    <main className='flex h-screen w-full justify-center items-center'>
        <SignIn />
    </main>
  )
}

export default SigninPage