import type { IconType } from 'react-icons';
import { Fragment } from 'react';
import { Box, Flex, Text, VStack, HStack, Link, Icon, useBreakpointValue } from '@chakra-ui/react';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaSpotify } from 'react-icons/fa';

export const Footer = () => {
  const isDesktop = useBreakpointValue({ base: false, md: true });

  const links = [
    { label: 'GitHub', icon: FaGithub, href: 'https://github.com/JoaccoG' },
    { label: 'LinkedIn', icon: FaLinkedin, href: 'https://www.linkedin.com/in/joaquin--godoy/' },
    {
      label: 'Spotify',
      icon: FaSpotify,
      href: 'https://open.spotify.com/user/31ar645vn4nkna54jly27vcviviy?si=fb87792c1bc746e1'
    },
    { label: 'Instagram', icon: FaInstagram, href: 'https://www.instagram.com/joacogodoy99' },
    { label: 'Email', icon: FaEnvelope, href: 'mailto:joaquingodoy2407@gmail.com' }
  ];

  return (
    <>
      {isDesktop && (
        <>
          <Sidebar position="left" showIcon={true} links={links} />
          <Sidebar position="right" showIcon={false} links={links.filter((link) => link.label === 'Email')} />
        </>
      )}

      <Box as="footer" borderTop="1px" borderColor="var(--color-neutral-dark-gray)" pt="16" mt="auto">
        <Flex maxW="1200px" mx="auto" px={{ base: '4', md: '0' }} direction="column" align="center" gap="6">
          {!isDesktop && (
            <HStack gap="6">
              {links.map((social) => (
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
  showIcon?: boolean;
  position: 'left' | 'right';
  links: { label: string; icon: IconType; href: string }[];
}

const Sidebar = ({ showIcon, position, links }: SidebarProps) => {
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
