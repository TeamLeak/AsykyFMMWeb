import {
    Box,
    Heading,
    Text,
    VStack,
    Button,
    useToast,
    Grid,
    GridItem,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    useDisclosure,
    Input,
    FormControl,
    FormLabel,
    Select,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const router = useRouter();
    const toast = useToast();
    const url = typeof window !== 'undefined' ? localStorage.getItem('url') : null;
    const secretKey = typeof window !== 'undefined' ? localStorage.getItem('secretKey') : null;

    const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
    const { isOpen: isImportOpen, onOpen: onImportOpen, onClose: onImportClose } = useDisclosure();

    const [listNames, setListNames] = useState<string[]>([]); // Список всех списков
    const [selectedList, setSelectedList] = useState<string | null>(null); // Выбранный список для добавления файла
    const [filesInList, setFilesInList] = useState<any[]>([]); // Файлы в выбранном списке
    const [loadingFiles, setLoadingFiles] = useState(false); // Индикатор загрузки файлов
    const [newFile, setNewFile] = useState(''); // Новый файл для добавления
    const [newFileHash, setNewFileHash] = useState(''); // Хеш нового файла
    const [importedData, setImportedData] = useState<any[]>([]); // Данные из импортированного JSON
    const [fileError, setFileError] = useState<string | null>(null); // Ошибка при загрузке файла

    useEffect(() => {
        if (!url || !secretKey) {
            toast({
                title: '❗ Вы не вошли в аккаунт!',
                description: 'Пожалуйста войдите, чтобы получить доступ к данным.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            router.push('/login');
        }
    }, [url, secretKey, router, toast]);


    const handleLogout = () => {
        localStorage.removeItem('url');
        localStorage.removeItem('secretKey');
        router.push('/login');
    };

    const fetchListNames = async () => {
        try {
            const res = await axios.get(`${url}/verify/lists`, {
                params: {
                    secret_key: secretKey,
                },
            });
            setListNames(res.data);
        } catch (err) {
            toast({
                title: 'Ошибка получения списка!',
                description: 'Произошла ошибка получения списков!',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // Запрос файлов для выбранного списка
    const fetchFilesInList = async (listName: string) => {
        try {
            setLoadingFiles(true);
            const res = await axios.get(`${url}/verify/list`, {
                params: {
                    type: listName,
                    secret_key: secretKey,
                },
            });
            setFilesInList(res.data); // Здесь API возвращает файлы для конкретного списка
            setLoadingFiles(false);
        } catch (err) {
            toast({
                title: 'Ошибка получения файлов!',
                description: 'Произошла какая-то ошибка при получении файлов!',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setLoadingFiles(false);
        }
    };

    // Выбор списка для просмотра файлов
    const handleSelectList = (listName: string) => {
        setSelectedList(listName);
        fetchFilesInList(listName);
    };

    // Добавление файла
    const handleAddFile = async () => {
        if (!selectedList) {
            toast({
                title: 'Выберите  список!',
                description: 'Пожалуйста укажите список куда импортировать!',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const file = {
                name: newFile,
                hash: newFileHash,
            };
            await axios.post(`${url}/verify/add`, file, {
                params: {
                    type: selectedList, // Используем выбранный список
                    secret_key: secretKey,
                },
            });
            toast({
                title: 'Файл успешно добавлен!',
                description: `Файл был добавлен в список: "${selectedList}".`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setNewFile('');
            setNewFileHash('');
            onAddClose();
        } catch (err) {
            toast({
                title: 'Ошибка добавления файла!',
                description: 'Произошла ошибка добавления файла!',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // Загрузка файла JSON и проверка на ошибки
    const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target?.result as string);
                    if (!Array.isArray(data)) {
                        throw new Error('Invalid file structure');
                    }
                    setImportedData(data);
                    setFileError(null); // Очищаем ошибку, если файл корректен
                } catch (err) {
                    setFileError('Ошибка: неверная структура файла');
                    setImportedData([]); // Очищаем данные при ошибке
                }
            };
            reader.readAsText(file);
        }
    };

    // Импорт данных из файла в выбранный список
    const handleImportData = async () => {
        if (!selectedList) {
            toast({
                title: 'Выберите список!',
                description: 'Пожалуйста, укажите список!',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            for (const item of importedData) {
                await axios.post(`${url}/verify/add`, item, {
                    params: {
                        type: selectedList,
                        secret_key: secretKey,
                    },
                });
            }
            toast({
                title: 'Данные успешно импортированы!',
                description: `Данные усмпешно импортированы в список: "${selectedList}".`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setImportedData([]);
            onImportClose();
        } catch (err) {
            toast({
                title: 'Ошибка импорта данных!',
                description: 'Произошла ошибка во время импорта данных!',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box
            p={8}
            bgGradient="linear(to-r, gray.900, gray.800)"
            minHeight="100vh"
            color="white"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <Box
                bg="gray.700"
                p={10}
                rounded="xl"
                shadow="2xl"
                maxW="1000px"
                textAlign="center"
                transition="transform 0.3s"
                _hover={{ transform: 'scale(1.02)' }}
            >
                <Heading mb={4} textAlign="center" fontSize="3xl" color="teal.300" fontWeight="bold">
                    🌟 Добро пожаловать!
                </Heading>

                <Text textAlign="center" fontSize="lg" mb={8} color="gray.300">
                    Управляйте вашими списками как вы хотите!
                </Text>

                {/* Action Cards */}
                <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                    <GridItem>
                        <Box
                            bg="teal.600"
                            p={6}
                            rounded="lg"
                            shadow="lg"
                            transition="all 0.3s"
                            _hover={{ bg: 'teal.500', transform: 'translateY(-3px)' }}
                            onClick={() => {
                                fetchListNames();
                                onViewOpen();
                            }}
                            cursor="pointer"
                        >
                            <Heading size="md" color="white">📜 Посмотреть списки</Heading>
                        </Box>
                    </GridItem>

                    <GridItem>
                        <Box
                            bg="green.500"
                            p={6}
                            rounded="lg"
                            shadow="lg"
                            transition="all 0.3s"
                            _hover={{ bg: 'green.400', transform: 'translateY(-3px)' }}
                            onClick={() => {
                                fetchListNames(); // Запрашиваем списки перед добавлением файла
                                onAddOpen();
                            }}
                            cursor="pointer"
                        >
                            <Heading size="md" color="white">➕ Добавить файл</Heading>
                        </Box>
                    </GridItem>

                    <GridItem>
                        <Box
                            bg="blue.500"
                            p={6}
                            rounded="lg"
                            shadow="lg"
                            transition="all 0.3s"
                            _hover={{ bg: 'blue.400', transform: 'translateY(-3px)' }}
                            onClick={() => {
                                fetchListNames();
                                onImportOpen();
                            }}
                            cursor="pointer"
                        >
                            <Heading size="md" color="white">📥 Импорт списка</Heading>
                        </Box>
                    </GridItem>
                </Grid>

                <Button
                    colorScheme="red"
                    mt={10}
                    size="lg"
                    onClick={handleLogout}
                    bg="red.500"
                    _hover={{ bg: 'red.600' }}
                    transition="background 0.3s"
                    shadow="lg"
                >
                    🔓 Выйти из аккаунта
                </Button>
            </Box>

            {/* Modal for Importing File */}
            <Modal isOpen={isImportOpen} onClose={onImportClose} size="lg">
                <ModalOverlay />
                <ModalContent bg="gray.800" color="white">
                    <ModalHeader>📥 Импортировать из файла</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel>Выберите JSON файл</FormLabel>
                            <Input
                                type="file"
                                accept=".json"
                                onChange={handleFileImport}
                                bg="gray.700"
                                borderColor="gray.600"
                                focusBorderColor="teal.300"
                            />
                            {fileError && <Text color="red.500">{fileError}</Text>}
                        </FormControl>

                        {importedData.length > 0 && (
                            <>
                                <Heading size="md" mb={4}>Предпросмотр данных</Heading>
                                <Table variant="simple" size="sm">
                                    <Thead>
                                        <Tr>
                                            <Th color="gray.300">Название</Th>
                                            <Th color="gray.300">Hash</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {importedData.map((file, index) => (
                                            <Tr key={index}>
                                                <Td>{file.name}</Td>
                                                <Td>{file.hash}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>

                                <FormControl mt={4}>
                                    <FormLabel>Выберите список для импорта</FormLabel>
                                    <Select
                                        placeholder="Выберите список"
                                        value={selectedList || ''}
                                        onChange={(e) => setSelectedList(e.target.value)}
                                        bg="gray.700"
                                        borderColor="gray.600"
                                        focusBorderColor="teal.300"
                                    >
                                        {listNames.map((listName, index) => (
                                            <option key={index} value={listName}>
                                                {listName}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            colorScheme="green"
                            onClick={handleImportData}
                            isDisabled={!importedData.length || !selectedList}
                        >
                            Импортировать
                        </Button>
                        <Button colorScheme="blue" onClick={onImportClose}>
                            Закрыть
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Modal for View Lists */}
            <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
                <ModalOverlay />
                <ModalContent bg="gray.800" color="white">
                    <ModalHeader>📜 Просмотр Списков</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedList ? (
                            <>
                                <Heading size="md" mb={4}>Files in "{selectedList}"</Heading>
                                {loadingFiles ? (
                                    <Text>Загружаю файлы...</Text>
                                ) : (
                                    <Table variant="simple" size="sm">
                                        <Thead>
                                            <Tr>
                                                <Th color="gray.300">Название</Th>
                                                <Th color="gray.300">Hash</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {filesInList.map((file, index) => (
                                                <Tr key={index}>
                                                    <Td>{file.name}</Td>
                                                    <Td>{file.hash}</Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                )}
                            </>
                        ) : (
                            <>
                                <Heading size="md" mb={4}></Heading>
                                <Table variant="simple" size="sm">
                                    <Thead>
                                        <Tr>
                                            <Th color="gray.300">Название списка</Th>
                                            <Th></Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {listNames.map((listName, index) => (
                                            <Tr key={index}>
                                                <Td>{listName}</Td>
                                                <Td>
                                                    <Button size="sm" colorScheme="teal" onClick={() => handleSelectList(listName)}>
                                                        Посмотреть файлы
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="teal" onClick={onViewClose}>
                            Закрыть
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Modal for Add File */}
            <Modal isOpen={isAddOpen} onClose={onAddClose} size="lg">
                <ModalOverlay />
                <ModalContent bg="gray.800" color="white">
                    <ModalHeader>➕ Добавление файла</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel>Список</FormLabel>
                            <Select
                                placeholder="Выберите список"
                                value={selectedList || ''}
                                onChange={(e) => setSelectedList(e.target.value)}
                                bg="gray.700"
                                borderColor="gray.600"
                                focusBorderColor="teal.300"
                            >
                                {listNames.map((listName, index) => (
                                    <option key={index} value={listName}>
                                        {listName}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Название файла</FormLabel>
                            <Input
                                placeholder="Введите название файла"
                                value={newFile}
                                onChange={(e) => setNewFile(e.target.value)}
                                bg="gray.700"
                                borderColor="gray.600"
                                focusBorderColor="teal.300"
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Хеш файла</FormLabel>
                            <Input
                                placeholder="Введите hash файла"
                                value={newFileHash}
                                onChange={(e) => setNewFileHash(e.target.value)}
                                bg="gray.700"
                                borderColor="gray.600"
                                focusBorderColor="teal.300"
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="green" onClick={handleAddFile} margin={"2"}>
                            Добавить
                        </Button>
                        <Button colorScheme={"blue"} onClick={onAddClose}>
                            Закрыть
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default AdminDashboard;
