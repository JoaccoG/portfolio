import { Fragment } from 'react';
import { Box, Flex, Text, VStack, HStack, Link, Icon, useBreakpointValue } from '@chakra-ui/react';
import { SOCIAL_LINKS, type SocialLink } from '@constants/links';

export const Footer = () => {
  const isDesktop = useBreakpointValue({ base: false, md: true });

  return (
    <>
      {isDesktop && (
        <>
          <Sidebar position="left" links={SOCIAL_LINKS} showIcon={true} />
          <Sidebar position="right" links={SOCIAL_LINKS.filter((link) => link.label === 'Email')} showIcon={false} />
        </>
      )}

      <Box as="footer" borderTop="1px" borderColor="var(--color-neutral-dark-gray)" pt="16" mt="auto">
        <Flex maxW="1200px" mx="auto" px={{ base: '4', md: '0' }} direction="column" align="center" gap="6">
          {!isDesktop && (
            <HStack gap="6">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  color="var(--color-neutral-light-gray)"
                  _hover={{ color: 'var(--color-neutral-white)', transform: 'translateY(-2px)' }}
                  transition="all 0.2s ease">
                  <Icon as={social.icon} boxSize="6" />
                </Link>
              ))}
            </HStack>
          )}
          <Text
            fontSize="sm"
            color="var(--color-neutral-light-gray)"
            fontFamily="var(--font-family-inter)"
            textAlign="center">
            Designed & Built by <span style={{ color: 'var(--color-neutral-white)' }}>Joaquín Godoy</span> &copy;{' '}
            {new Date().getFullYear()}
          </Text>
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
      display="flex"
      position="fixed"
      paddingX="4"
      gap="6"
      {...(position === 'left' ? { left: '0' } : { right: '0' })}
      bottom="0"
      zIndex="sticky"
      alignItems="center"
      flexDirection="column">
      <Box width="1px" height="100px" background="var(--color-neutral-light-gray)" />
      <VStack gap={6}>
        {links.map((link) => (
          <Fragment key={link.label}>
            {showIcon && (
              <Link
                w="6"
                h="6"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                color="var(--color-neutral-light-gray)"
                _hover={{ color: 'var(--color-neutral-white)', transform: 'translateY(-2px)' }}
                transition="all 0.2s ease"
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
                _hover={{ color: 'var(--color-neutral-white)' }}
                transition="color 0.2s ease"
                fontSize="sm"
                writingMode="vertical-rl"
                textOrientation="mixed"
                letterSpacing="0.1em"
                transform="rotate(180deg)">
                {link.href.split(':')[1]}
              </Link>
            )}
          </Fragment>
        ))}
      </VStack>
      <Box width="1px" height="100px" background="var(--color-neutral-light-gray)" />
    </Box>
  );
};
