// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import Home from './components/Home';
import CreateFormPage from './components/CreateFormPage';
import FormsList from './components/FormsList'; 
import EditForm from './components/EditFormPage';
import RenderForm from './components/FormRender';
import FormResponses from './components/FormResponses';



function App() {
  return (
    <Router>
      <Container>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: 'white' }}>
              QuickQ
            </Typography>
          </Toolbar>
        </AppBar>

        <div style={{ paddingTop: '80px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-form" element={<CreateFormPage />} />
            <Route path="/forms" element={<FormsList />} />
            <Route path="/editform/:formId" element={<EditForm />} />
            <Route path="/renderform/:formId" element={<RenderForm />} />
            <Route path="/form-responses/:formId" element={<FormResponses/>} />
          </Routes>
        </div>
      </Container>
    </Router>
  );
}

export default App;