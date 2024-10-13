import { useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel, Heading, useToast, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const LoginPage = () => {
    const [url, setUrl] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const toast = useToast();
    const router = useRouter();

    const handleLogin = async () => {
        try {
            if (url && secretKey) {
                toast({
                    title: '🎉 Success!',
                    description: 'You have successfully authenticated! 🎊',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                localStorage.setItem('url', url);
                localStorage.setItem('secretKey', secretKey);
                router.push('/admin').then(r => console.log(r));
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (err) {
            toast({
                title: '🚫 Error',
                description: 'Invalid URL or secret key. Please try again!',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box
            height="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgGradient="linear(to-r, teal.800, gray.900)"
            px={4}
        >
            <Box
                p={10}
                bg="gray.700"
                rounded="xl"
                shadow="2xl"
                maxWidth="400px"
                w="full"
                border="1px solid"
                borderColor="gray.600"
                textAlign="center"
                transition="transform 0.3s"
                _hover={{ transform: 'scale(1.02)' }}
            >
                <Heading textAlign="center" mb={8} fontSize="2xl" color="teal.300">
                    🔐 Вход в аккаунт
                </Heading>
                <VStack spacing={6}>
                    <FormControl>
                        <FormLabel color="teal.200">🔗 API URL</FormLabel>
                        <Input
                            placeholder="Enter the API URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            bg="gray.800"
                            borderColor="gray.600"
                            focusBorderColor="teal.400"
                            color="white"
                            _hover={{ borderColor: 'teal.300' }}
                            shadow="md"
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel color="teal.200">🗝️ Секретный ключ</FormLabel>
                        <Input
                            placeholder="Enter your secret key"
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                            type="password"
                            bg="gray.800"
                            borderColor="gray.600"
                            focusBorderColor="teal.400"
                            color="white"
                            _hover={{ borderColor: 'teal.300' }}
                            shadow="md"
                        />
                    </FormControl>

                    <Button
                        colorScheme="teal"
                        w="full"
                        onClick={handleLogin}
                        bgGradient="linear(to-r, teal.400, teal.500)"
                        _hover={{ bgGradient: 'linear(to-r, teal.500, teal.600)' }}
                        color="white"
                        shadow="lg"
                        transition="background 0.3s, transform 0.3s"
                    >
                        🚀 Продолжить
                    </Button>
                </VStack>
            </Box>
        </Box>
    );
};

export default LoginPage;
