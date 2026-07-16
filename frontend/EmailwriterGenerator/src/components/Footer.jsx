import { Box, Container, Grid, Link, Typography, Divider, useTheme } from '@mui/material';

export default function Footer({ onNavigate }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const handleLinkClick = (e, page) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 6,
        px: 2,
        backgroundColor: isDarkMode ? 'rgba(9, 13, 22, 0.4)' : 'rgba(240, 244, 248, 0.4)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                display: 'inline-block',
                letterSpacing: '-0.5px'
              }}
            >
              💌 MailGenie
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 300, lineHeight: 1.6 }}>
              AI-powered email assistant that helps you write and reply to emails faster and more professionally directly inside Gmail or the browser.
            </Typography>
          </Grid>

          <Grid item xs={6} sm={4} md={2.5}>
            <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Product
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link href="#" onClick={(e) => handleLinkClick(e, 'about')} color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                About / Press
              </Link>
              <Link href="#" onClick={(e) => handleLinkClick(e, 'blog')} color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Blog
              </Link>
              <Link href="#" onClick={(e) => handleLinkClick(e, 'careers')} color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Careers
              </Link>
            </Box>
          </Grid>

          <Grid item xs={6} sm={4} md={2.5}>
            <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link href="#" onClick={(e) => handleLinkClick(e, 'help')} color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Help / FAQ
              </Link>
              <Link href="#" onClick={(e) => handleLinkClick(e, 'contact')} color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Contact Us
              </Link>
              <Link href="#" onClick={(e) => handleLinkClick(e, 'guides')} color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Guides
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4} md={2.5}>
            <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link href="#" onClick={(e) => handleLinkClick(e, 'terms')} color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Terms of Use
              </Link>
              <Link href="#" onClick={(e) => handleLinkClick(e, 'privacy')} color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Privacy Policy
              </Link>
              <Link href="#" onClick={(e) => handleLinkClick(e, 'security')} color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Security
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} MailGenie. All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            AI-powered productivity. Powered by Groq, OpenAI, Gemini, and Claude.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
