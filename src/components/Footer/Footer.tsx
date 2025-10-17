import { Fragment, useRef } from 'react';
import { Box, Flex, Text, VStack, HStack, Link, Icon, useBreakpointValue } from '@chakra-ui/react';
import { motion, useInView } from 'framer-motion';
import { SOCIAL_LINKS, type SocialLink } from '@constants/links';

export const Footer = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: '-100px' });
  const isDesktop = useBreakpointValue({ base: false, md: true });

  return (
    <>
      <Box as="footer" ref={footerRef} borderTop="1px" borderColor="var(--color-neutral-dark-gray)" pt="16" mt="auto">
        {isDesktop && (
          <>
            <Sidebar position="left" links={SOCIAL_LINKS} showIcon={true} />
            <Sidebar position="right" links={SOCIAL_LINKS.filter((link) => link.label === 'Email')} showIcon={false} />
          </>
        )}

        <Flex maxW="1200px" mx="auto" px={{ base: '4', md: '0' }} direction="column" align="center" gap="6">
          {!isDesktop && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}>
              <HStack gap="6">
                {SOCIAL_LINKS.map((social, index) => (
                  <motion.div
                    key={social.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}>
                    <Link
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      color="var(--color-neutral-light-gray)"
                      _hover={{ color: 'var(--color-neutral-white)', transform: 'translateY(-2px)' }}
                      transition="all 0.2s ease">
                      <Icon as={social.icon} boxSize="6" />
                    </Link>
                  </motion.div>
                ))}
              </HStack>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}>
            <Text
              fontSize="sm"
              color="var(--color-neutral-light-gray)"
              fontFamily="var(--font-family-inter)"
              textAlign="center">
              Designed & Built by <span style={{ color: 'var(--color-neutral-white)' }}>Joaquín Godoy</span> &copy;{' '}
              {new Date().getFullYear()}
            </Text>
          </motion.div>
        </Flex>
      </Box>
    </>
  );
};

interface SidebarProps {
  position: 'left' | 'right';
  links: SocialLink[];
  showIcon: boolean;
}

const Sidebar = ({ position, links, showIcon }: SidebarProps) => {
  return (
    <Box
      zIndex="sticky"
      display="flex"
      position="fixed"
      px="4"
      gap="6"
      {...(position === 'left' ? { left: '0' } : { right: '0' })}
      bottom="0"
      alignItems="center"
      flexDirection="column">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}>
        <Box w="1px" h="100px" bg="var(--color-neutral-light-gray)" opacity="0.5" />
      </motion.div>
      <VStack gap="6">
        {links.map((link, index) => (
          <motion.div
            key={link.label}
            initial={{ x: showIcon ? -20 : 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 + index * 0.1, ease: 'easeOut' }}>
            <Fragment>
              {showIcon && (
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  color="var(--color-neutral-light-gray)"
                  _hover={{ color: 'var(--color-neutral-white)', transform: 'translateY(-2px)' }}
                  transition="all 0.2s ease"
                  w="6"
                  h="6"
                  display="flex"
                  alignItems="center"
                  justifyContent="center">
                  <Icon as={link.icon} boxSize="5" />
                </Link>
              )}
              {!showIcon && (
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  color="var(--color-neutral-light-gray)"
                  _hover={{ color: 'var(--color-neutral-white)', transform: 'translateX(2px)' }}
                  transition="all 0.2s ease"
                  fontSize="sm"
                  writingMode="vertical-rl"
                  textOrientation="mixed"
                  letterSpacing="0.1em">
                  {link.href.split(':')[1]}
                </Link>
              )}
            </Fragment>
          </motion.div>
        ))}
      </VStack>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}>
        <Box w="1px" h="100px" bg="var(--color-neutral-light-gray)" opacity="0.5" />
      </motion.div>
    </Box>
  );
};
