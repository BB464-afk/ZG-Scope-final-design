import React from 'react';
import ProjectConfig from './ProjectConfig';

export default function ProjectConfigurationRouter() {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#F7F9FC'
    }}>
      {/* Render Project Configuration */}
      <ProjectConfig />
    </div>
  );
}