import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { AppProviders } from './providers/AppProviders'

function App() {
  return (
    <AppProviders>
      <Box component="main">
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography variant="h1" component="h1">
            Todo lists
          </Typography>
        </Container>
      </Box>
    </AppProviders>
  )
}

export default App
