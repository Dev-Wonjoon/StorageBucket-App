import React from 'react';
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './shared/components/Layout'
import DownloadPage from './features/download';
import MediaPage from './features/media';
import PlatformPage from './features/platform';
import PlatformDetail from './features/platform/PlatformDetail';
import MediaDetailPage from './features/media/MediaDetailPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<DownloadPage />}/>
          <Route path='/media' element={<MediaPage/>} />
          <Route path='/platform' element={<PlatformPage />} />
          <Route path='/platforms/:platformName' element={<PlatformDetail />} />
          <Route path="/media/:mediaId" element={<MediaDetailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
