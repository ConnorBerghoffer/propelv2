// Client-side login logic
'use client'
import { createClient } from "@/utils/supabase/client";
import { Flex, Button, Text, Heading, Stack, Image, Box } from "@chakra-ui/react";
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  
  const signInWithGoogle = async () => {
    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      router.push(`/login?message=${encodeURIComponent(error.message)}`);
    }
  };

  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={4} w={'full'} maxW={'md'}>
          <Heading fontSize={'2xl'}>Sign in to your account</Heading>
          <Box className="">
              <button onMouseDown={signInWithGoogle} className="flex gap-2 px-4 py-2 transition duration-150 border rounded-lg border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow">
                  <Image className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"/>
                  <span>Login with Google</span>
              </button>
          </Box>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={'Login Image'}
          objectFit={'cover'}
          src={
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
          }
        />
      </Flex>
    </Stack>
  );
}
