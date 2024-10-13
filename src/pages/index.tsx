import Head from 'next/head';
import { Box, Button, Flex, Heading, Link, Text, VStack, SimpleGrid } from '@chakra-ui/react';
import localFont from 'next/font/local';
import { FaGithub, FaRocket, FaCloud, FaShieldAlt, FaCheckCircle } from 'react-icons/fa'; // Иконки

// Подключаем кастомные шрифты
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function Home() {
  return (
      <>
        <Head>
          <title>Asyky Verify Manager - Управление списками файлов</title>
          <meta name="description" content="Asyky Verify Manager - удобный инструмент для управления списками файлов в экосистеме Asyky." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* Основная страница */}
        <Box
            minH="100vh"
            bgGradient="linear(to-r, teal.600, blue.500)"
            className={`${geistSans.variable} ${geistMono.variable}`}
            color="white"
        >
          {/* Главный контент */}
          <Flex
              direction="column"
              align="center"
              justify="center"
              h="100vh"
              p={4}
              textAlign="center"
          >

            {/* Заголовок */}
            <Heading as="h1" fontSize="5xl" mb={6} fontWeight="bold" textShadow="2px 2px 4px rgba(0, 0, 0, 0.3)">
              Asyky Verify Manager
            </Heading>

            {/* Описание продукта */}
            <Text fontSize="lg" mb={8} maxW="800px">
              Asyky Verify Manager — это удобный инструмент для управления списками файлов проверки в Asyky Launcher.
              Это часть экосистемы <b>Asyky</b>, позволяющая легко настраивать и управлять файлами через удобный веб-интерфейс.
            </Text>

            {/* CTA кнопки */}
            <VStack spacing={4}>
              <Link href="/admin">
                <Button
                    colorScheme="teal"
                    size="lg"
                    bg="white"
                    color="black"
                    _hover={{ bg: 'gray.200' }}
                    shadow="lg"
                    leftIcon={<FaRocket />} // Иконка ракеты для перехода к управлению списками
                >
                  Перейти к управлению списками
                </Button>
              </Link>

              <Link href="https://github.com/TeamLeak" isExternal>
                <Button
                    colorScheme="gray"
                    size="lg"
                    leftIcon={<FaGithub />} // Иконка GitHub для ссылки на организацию
                    variant="outline"
                    _hover={{ bg: 'gray.600', color: 'white' }}
                >
                  GitHub Организации
                </Button>
              </Link>
            </VStack>
          </Flex>

          {/* Преимущества использования Asyky Verify Manager */}
          <Box bg="gray.900" p={16} mt={10}>
            <Heading as="h2" fontSize="4xl" textAlign="center" mb={12} color="white">
              Преимущества Asyky Verify Manager
            </Heading>

            {/* Карточки преимуществ */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} maxW="1200px" mx="auto">
              {/* Карточка автоматизации */}
              <Box
                  bg="gray.700"
                  borderRadius="lg"
                  p={8}
                  shadow="lg"
                  transition="transform 0.3s ease"
                  _hover={{ transform: 'translateY(-8px)', bg: 'gray.600' }}
              >
                <VStack spacing={4} align="center">
                  <FaCloud size={48} color="teal.400" /> {/* Иконка облака */}
                  <Heading as="h3" fontSize="2xl" color="white">
                    Автоматизация
                  </Heading>
                  <Text textAlign="center" color="gray.300">
                    Автоматизация процесса проверки файлов через управление списками для проверки, используемые в Asyky Launcher.
                  </Text>
                </VStack>
              </Box>

              {/* Карточка удобного интерфейса */}
              <Box
                  bg="gray.700"
                  borderRadius="lg"
                  p={8}
                  shadow="lg"
                  transition="transform 0.3s ease"
                  _hover={{ transform: 'translateY(-8px)', bg: 'gray.600' }}
              >
                <VStack spacing={4} align="center">
                  <FaCheckCircle size={48} color="teal.400" /> {/* Иконка удобства */}
                  <Heading as="h3" fontSize="2xl" color="white">
                    Удобный интерфейс
                  </Heading>
                  <Text textAlign="center" color="gray.300">
                    Простой и интуитивный интерфейс для настройки списков файлов для проверки в вашем лаунчере.
                  </Text>
                </VStack>
              </Box>

              {/* Карточка безопасности */}
              <Box
                  bg="gray.700"
                  borderRadius="lg"
                  p={8}
                  shadow="lg"
                  transition="transform 0.3s ease"
                  _hover={{ transform: 'translateY(-8px)', bg: 'gray.600' }}
              >
                <VStack spacing={4} align="center">
                  <FaShieldAlt size={48} color="teal.400" /> {/* Иконка безопасности */}
                  <Heading as="h3" fontSize="2xl" color="white">
                    Безопасность
                  </Heading>
                  <Text textAlign="center" color="gray.300">
                    Ваши данные и списки файлов защищены.
                  </Text>
                </VStack>
              </Box>
            </SimpleGrid>
          </Box>

        </Box>
      </>
  );
}
