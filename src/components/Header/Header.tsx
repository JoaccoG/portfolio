import { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { Box, Flex, Button, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

export const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  const handleNavMenu = (newState: boolean): void => {
    setIsNavOpen(newState);
    if (newState) {
      document.body.style.overflow = 'hidden';
      setHamburgerTransform({
        line1: 'rotate(45deg) translate(10px, 5px)',
        line2: 'translateX(48px)',
        line3: 'rotate(-45deg) translate(10px, -5px)',
        line2Opacity: 0
      });
    } else {
      document.body.style.overflow = '';
      setHamburgerTransform({
        line1: 'rotate(0)',
        line2: 'translateX(0)',
        line3: 'rotate(0)',
        line2Opacity: 1
      });
    }
  };

  useEffect((): void => {
    setLastScrollY(window.scrollY);
    setHasScrolled(window.scrollY >= 16);
  }, []);

  useEffect((): (() => void) => {
    const handleScroll = (): void => {
      const currentScrollY: number = window.scrollY;
      setLastScrollY(currentScrollY);
      setHasScrolled(currentScrollY >= 16);
      if (currentScrollY > lastScrollY && currentScrollY > 80) setIsHeaderVisible(false);
      else setIsHeaderVisible(true);
    };

    const handleResize = (): void => {
      if (window.innerWidth >= 768 && isNavOpen) handleNavMenu(false);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return (): void => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [lastScrollY, isNavOpen]);

  const [hamburgerTransform, setHamburgerTransform] = useState({
    line1: 'rotate(0)',
    line2: 'translateX(0)',
    line3: 'rotate(0)',
    line2Opacity: 1
  });

  const navItems = [
    { path: '/', label: 'Home', number: '01.' },
    { path: '/about', label: 'About', number: '02.' },
    { path: '/work', label: 'Work', number: '03.' },
    { path: '/blog', label: 'Blog', number: '04.' }
  ];

  return (
    <>
      {/* Header Overlay */}
      {isNavOpen && (
        <Box
          display={{ base: 'block', md: 'none' }}
          position="fixed"
          top="0"
          left="0"
          w="100vw"
          h="100vh"
          zIndex="var(--z-index-400)"
          backdropFilter="blur(8px)"
          onClick={() => handleNavMenu(false)}
          data-testid="header-overlay"
        />
      )}

      {/* Header Container */}
      <Box
        as="header"
        position="fixed"
        top="0"
        right="0"
        w="100%"
        h="80px"
        px="8"
        py="4"
        bg="transparent"
        backdropFilter={hasScrolled && !isNavOpen ? 'blur(8px)' : 'none'}
        transform={isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)'}
        transition="transform 0.2s ease-in-out"
        zIndex="var(--z-index-500)"
        _after={{
          content: '""',
          position: 'absolute',
          bottom: '0',
          left: '50%',
          width: '100%',
          height: '1px',
          background: 'var(--color-neutral-dark-gray)',
          transformOrigin: 'center',
          transition: 'opacity 0.1s ease-in-out, transform 0.3s ease-in-out',
          opacity: isNavOpen ? '0' : '1',
          transform: `translateX(-50%) scaleX(${hasScrolled ? '1' : '0'})`
        }}>
        <Flex h="100%" mx="auto" align="center" justify="space-between">
          {/* Logo */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, ease: 'easeOut' }}>
            <Box
              aria-label="Logo"
              cursor="pointer"
              fontSize={{ base: 'var(--font-size-l)', sm: 'var(--font-size-xl)' }}
              fontWeight="var(--font-weight-bold)"
              fontFamily="var(--font-family-fira-code)">
              <NavLink
                to="/"
                rel="noopener noreferrer"
                data-testid="Logo"
                onClick={() => handleNavMenu(false)}
                style={{
                  background: 'linear-gradient(to right, #ff8a65, #c62828 33.33334%, #c62828 66.66667%, #ff8a65)',
                  backgroundSize: '300% 100%',
                  backgroundPosition: 'top left',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  transition: 'all 0.3s ease-in-out',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundPosition = 'top left 100%';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundPosition = 'top left';
                }}>
                Joaquín Godoy
              </NavLink>
            </Box>
          </motion.div>

          {/* Navigation */}
          <Box aria-label="Navigation menu">
            {/* Hamburger Button */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, ease: 'easeOut' }}>
              <Button
                display={{ base: 'flex', md: 'none' }}
                flexDirection="column"
                justifyContent="space-between"
                h="24px"
                w="32px"
                variant="ghost"
                bg="transparent"
                border="none"
                cursor="pointer"
                zIndex="500"
                aria-label="Toggle navigation menu"
                onClick={() => handleNavMenu(!isNavOpen)}
                _hover={{ bg: 'transparent' }}
                _active={{ bg: 'transparent' }}>
                <Box
                  display="block"
                  h="3px"
                  w="100%"
                  bg="var(--color-neutral-white)"
                  borderRadius="16px"
                  transition="transform 0.3s ease, opacity 0.2s ease-in-out"
                  transform={hamburgerTransform.line1}
                />
                <Box
                  display="block"
                  w="100%"
                  h="3px"
                  bg="var(--color-neutral-white)"
                  borderRadius="16px"
                  transition="transform 0.3s ease, opacity 0.2s ease-in-out"
                  opacity={hamburgerTransform.line2Opacity}
                  transform={hamburgerTransform.line2}
                />
                <Box
                  display="block"
                  h="3px"
                  w="100%"
                  bg="var(--color-neutral-white)"
                  borderRadius="16px"
                  transition="transform 0.3s ease, opacity 0.2s ease-in-out"
                  transform={hamburgerTransform.line3}
                />
              </Button>
            </motion.div>

            {/* Navigation Menu */}
            <Box
              display="flex"
              justifyContent="center"
              position={{ base: 'absolute', md: 'sticky' }}
              top={{ base: 0, md: 'auto' }}
              right={{ base: 0, md: 'auto' }}
              w={{ base: '50%', md: 'auto' }}
              h={{ base: '100vh', md: 'auto' }}
              minW={{ base: '240px', md: 'auto' }}
              flexDirection={{ base: 'column', md: 'row' }}
              alignItems={{ base: 'stretch', md: 'center' }}
              p={{ base: 'var(--padding-l) var(--padding-xxxl)', md: 0 }}
              bg={{ base: 'var(--color-background)', md: 'transparent' }}
              borderLeft={{ base: '1px solid var(--color-neutral-dark-gray)', md: 'none' }}
              transform={{ base: isNavOpen ? 'translateX(0)' : 'translateX(100%)', md: 'translateX(0)' }}
              transition="transform 0.2s ease-in-out, box-shadow 0.15s ease-in-out">
              <HStack
                display={{ base: 'flex', md: 'flex' }}
                flexDirection={{ base: 'column', md: 'row' }}
                alignItems={{ base: 'stretch', md: 'center' }}
                gap={{ base: 0, md: 'var(--margin-l)' }}
                pl={{ base: '8', sm: 'var(--padding-6xl)', md: 0 }}
                m="0">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 1,
                      delay: (0.2 + index) * 0.2,
                      ease: 'easeOut'
                    }}>
                    <Box m={{ base: 'var(--margin-s) 0', md: 0 }}>
                      <NavLink
                        to={item.path}
                        rel="noopener noreferrer"
                        aria-label={item.label}
                        data-testid={item.label}
                        className={({ isActive }) => (isActive ? 'navlink-active' : '')}
                        style={({ isActive }) => ({
                          position: 'relative',
                          display: 'inline-block',
                          color: isActive ? 'var(--color-neutral-white)' : 'var(--color-neutral-light-gray)',
                          fontSize: 'var(--font-size-m)',
                          fontWeight: 'var(--font-weight-medium)',
                          padding: '4px 4px 4px 0',
                          textDecoration: 'none',
                          transition: 'color 0.2s ease-in-out'
                        })}
                        onClick={() => handleNavMenu(false)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--color-neutral-white)';
                        }}
                        onMouseLeave={(e) => {
                          const isActive = e.currentTarget.classList.contains('navlink-active');
                          e.currentTarget.style.color = isActive
                            ? 'var(--color-neutral-white)'
                            : 'var(--color-neutral-light-gray)';
                        }}>
                        <span
                          style={{
                            color: 'var(--color-accent-red)',
                            fontSize: 'var(--font-size-xs)',
                            fontFamily: 'var(--font-family-fira-code)'
                          }}>
                          {item.number}
                        </span>{' '}
                        {item.label}
                        <Box
                          position="absolute"
                          bottom="0"
                          left="0"
                          w="0"
                          h="2px"
                          bg="var(--color-neutral-dark-gray)"
                          transition="width 0.15s ease-in-out"
                          _groupHover={{ width: '100%' }}
                          _before={{
                            content: '""',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            background: 'var(--color-neutral-light-gray)',
                            display: 'none'
                          }}
                          css={{
                            '.navlink-active &': { width: '100%', bg: 'var(--color-neutral-light-gray)' }
                          }}
                        />
                      </NavLink>
                    </Box>
                  </motion.div>
                ))}
              </HStack>
            </Box>
          </Box>
        </Flex>
      </Box>
    </>
  );
};
