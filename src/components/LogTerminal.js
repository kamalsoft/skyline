// src/components/LogTerminal.js
import React, { useRef, useEffect, useState } from 'react';
import {
    Box, Text, HStack, useColorModeValue, IconButton, Tooltip,
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
    AlertDialogContent, AlertDialogOverlay, useDisclosure, Button
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
            <Text color="gray.500" whiteSpace="nowrap">{log.timestamp}</Text>
            <Text color={textColor} whiteSpace="pre-wrap" wordBreak="break-word">{log.message}</Text>
        </HStack>
    );
}

function LogTerminal() {
    const { logs, clearLogs, clearCacheAndReload } = useLogs();
    const terminalRef = useRef(null);
    const bgColor = useColorModeValue('rgba(240, 240, 240, 0.9)', 'rgba(20, 20, 20, 0.9)');
    const borderColor = useColorModeValue('gray.300', 'gray.600');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef();
    const dragControls = useDragControls();

    const [size, setSize] = useState({ width: 500, height: 300 });
    // Auto-scroll to the bottom when new logs are added
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <motion.div
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
                <Box p={2} cursor="move" borderBottom="1px solid" borderColor={borderColor} as={HStack} justify="space-between" onPointerDown={(e) => dragControls.start(e)}>
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
                </Box>
                <Box
                    ref={terminalRef}
                    p={3}
                    fontFamily="monospace"
                    fontSize="sm"
                    overflowY="auto"
                    flex="1"
                >
                    {logs.map((log, index) => <LogEntry key={index} log={log} />)}
                </Box>
                <motion.div
                    drag="x, y"
                    onDrag={(event, info) => {
                        setSize(prevSize => ({
                            width: Math.max(300, prevSize.width + info.delta.x),
                            height: Math.max(200, prevSize.height + info.delta.y),
                        }));
                    }}
                    dragMomentum={false}
                    style={{
                        position: 'absolute',
                        bottom: '0px',
                        right: '0px',
                        width: '20px',
                        height: '20px',
                        cursor: 'nwse-resize',
                    }}
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
                            <Button colorScheme="red" onClick={clearCacheAndReload} ml={3}>Clear & Reload</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </motion.div>
    );
}

export default LogTerminal;