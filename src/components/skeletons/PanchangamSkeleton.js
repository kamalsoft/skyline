// src/components/skeletons/PanchangamSkeleton.js
import React from 'react';
import { Heading, VStack, Skeleton, SkeletonText } from '@chakra-ui/react';
import GlassCard from '../GlassCard';
import { motion } from 'framer-motion';

function PanchangamSkeleton() {
    return (
        <motion.div
            drag
            dragMomentum={false}
            style={{ position: 'fixed', top: '150px', right: '50px', width: '300px', zIndex: 1300 }}
        >
            <GlassCard p={4} borderRadius="xl" w="full" cursor="grab">
                <Heading size="md" mb={4}>Tamil Panchangam</Heading>
                <VStack align="stretch" spacing={4} mt={4}>
                    <Skeleton height="20px" width="60%" />
                    <Skeleton height="24px" width="40%" />
                    <SkeletonText mt={4} noOfLines={4} spacing="4" />
                </VStack>
            </GlassCard>
        </motion.div>
    );
}

export default PanchangamSkeleton;