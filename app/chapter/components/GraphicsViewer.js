// app/chapter/components/GraphicsViewer.js
import React, { useEffect, useState } from 'react';
import Modal from './Modal';

const GraphicsViewer = ({ chapterId, graphicId, isPlaying, onClose }) => {
  const [GraphicComponent, setGraphicComponent] = useState(null);

  useEffect(() => {
    if (isPlaying && graphicId) {
      const loadGraphic = async () => {
        try {
          const GraphicModule = await import(`../${chapterId}/graphics/${graphicId}.js`);
          setGraphicComponent(() => GraphicModule.default);
        } catch (error) {
          console.error(`Failed to load graphic: ${error.message}`);
          // eslint-disable-next-line react/display-name
          setGraphicComponent(() => () => <div>Failed to load graphic</div>);
        }
      };
      loadGraphic();
    } else {
      setGraphicComponent(null);
    }
  }, [chapterId, graphicId, isPlaying]);

  return (
    <Modal isOpen={isPlaying} onClose={onClose}>
      <div className="w-full h-full min-h-[300px] flex items-center justify-center">
        {GraphicComponent ? (
          <GraphicComponent />
        ) : (
          <div>Loading graphic...</div>
        )}
      </div>
    </Modal>
  );
};

export default GraphicsViewer;
