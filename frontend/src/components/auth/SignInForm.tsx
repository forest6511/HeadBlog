'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import { signInSchema } from '@/schemas/auth'
import type { z } from 'zod'

type SigninFormData = z.infer<typeof signInSchema>

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = (data: SigninFormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register('email')}
        label="メールアドレス"
        placeholder="example@example.com"
        type="email"
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
      />
      <Input
        {...register('password')}
        label="パスワード"
        placeholder="パスワードを入力"
        type="password"
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
      />
      <Button type="submit" color="primary" className="w-full">
        ログイン
      </Button>
    </form>
  )
}
