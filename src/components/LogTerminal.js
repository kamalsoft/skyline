// src/components/LogTerminal.js
import React, { useRef, useEffect, useState } from 'react';
import {
    Box, Text, HStack, useColorModeValue, IconButton, Tooltip,
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent,
    AlertDialogOverlay, useDisclosure, Button, VStack, ButtonGroup, useToast
} from '@chakra-ui/react';
import { motion, useDragControls } from 'framer-motion';
import { DeleteIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { useLogs } from '../contexts/LogContext';

const logColors = {
    info: { light: 'blue.500', dark: 'blue.300' },
    warn: { light: 'orange.500', dark: 'orange.300' },
    error: { light: 'red.500', dark: 'red.300' },
};

function LogEntry({ log }) {
    const color = logColors[log.level] || logColors.info;
    const textColor = useColorModeValue(color.light, color.dark);

    return (
        <HStack align="flex-start">
            <Text color="gray.500" whiteSpace="nowrap" minW="80px">{log.timestamp}</Text>
            <Text color="purple.400" whiteSpace="nowrap" fontWeight="bold" minW="120px" maxW="120px" isTruncated title={log.source}>[{log.source}]</Text>
            <Text color={textColor} whiteSpace="pre-wrap" wordBreak="break-word" flex="1">{log.message}</Text>
        </HStack>
    );
}

function LogTerminal() {
    const { logs, clearLogs, clearCacheAndReload } = useLogs();
    const terminalRef = useRef(null);
    const bgColor = useColorModeValue('rgba(245, 245, 245, 0.8)', 'rgba(26, 32, 44, 0.8)');
    const borderColor = useColorModeValue('gray.300', 'gray.600');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef();
    const dragControls = useDragControls();
    const toast = useToast();

    const [size, setSize] = useState({ width: 500, height: 300 });
    const [filterLevel, setFilterLevel] = useState('all'); // 'all', 'info', 'warn', 'error'

    const handleClearCache = () => {
        clearCacheAndReload();
        toast({
            title: "Cache Cleared",
            description: "Application is reloading with a fresh state.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        onClose();
    };

    // Auto-scroll to the bottom when new logs are added
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs, filterLevel]);

    const filteredLogs = logs.filter(log => {
        if (filterLevel === 'all') {
            return true;
        }
        return log.level === filterLevel;
    });
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            dragListener={false}
            dragControls={dragControls}
            dragMomentum={false}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: size.width,
                height: size.height,
                zIndex: 1400, // Ensure it's above other elements like drawers
            }}
        >
            <Box
                w="100%"
                h="100%"
                bg={bgColor}
                backdropFilter="blur(5px)"
                borderRadius="md"
                boxShadow="xl"
                border="1px solid"
                borderColor={borderColor}
                display="flex"
                flexDirection="column"
                overflow="hidden"
            >
                <Box p={2} cursor="move" borderBottom="1px solid" borderColor={borderColor} as={VStack} align="stretch" onPointerDown={(e) => dragControls.start(e)}>
                    <HStack justify="space-between">
                        <Text fontWeight="bold" pl={2}>Log Terminal</Text>
                        <HStack>
                            <Tooltip label="Clear logs" placement="top">
                                <IconButton icon={<DeleteIcon />} size="xs" variant="ghost" onClick={clearLogs} aria-label="Clear logs" />
                            </Tooltip>
                            <Tooltip label="Clear Cache & Reload" placement="top">
                                <IconButton
                                    icon={<WarningTwoIcon />}
                                    colorScheme="red"
                                    size="xs"
                                    variant="ghost"
                                    onClick={onOpen}
                                    aria-label="Clear cache and reload" />
                            </Tooltip>
                        </HStack>
                    </HStack>
                    <ButtonGroup size="xs" isAttached variant="outline" pt={1} onPointerDown={(e) => e.stopPropagation()}>
                        <Button onClick={() => setFilterLevel('all')} isActive={filterLevel === 'all'}>All</Button>
                        <Button onClick={() => setFilterLevel('info')} isActive={filterLevel === 'info'}>Info</Button>
                        <Button onClick={() => setFilterLevel('warn')} isActive={filterLevel === 'warn'}>Warn</Button>
                        <Button onClick={() => setFilterLevel('error')} isActive={filterLevel === 'error'}>Error</Button>
                    </ButtonGroup>
                </Box>
                <Box
                    ref={terminalRef}
                    p={3}
                    fontFamily="monospace"
                    fontSize="sm"
                    overflowY="auto"
                    flex="1"
                >
                    {filteredLogs.map((log, index) => <LogEntry key={index} log={log} />)}
                </Box>
                {/* Resize Handles */}
                <motion.div
                    drag="x"
                    onDrag={(event, info) => {
                        setSize(prevSize => ({
                            width: Math.max(300, prevSize.width + info.delta.x),
                            height: Math.max(200, prevSize.height + info.delta.y),
                        }));
                    }}
                    dragMomentum={false}
                    style={{ position: 'absolute', bottom: '0px', right: '0px', width: '20px', height: '20px', cursor: 'nwse-resize' }}
                />
            </Box>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Clear Cache and Reload
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure? This will delete all stored settings, clocks, and cached data, then reload the application.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>Cancel</Button>
                            <Button colorScheme="red" onClick={handleClearCache} ml={3}>Clear & Reload</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </motion.div>
    );
}

export default LogTerminal;