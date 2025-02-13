import React from 'react';
import Joyride from 'react-joyride';
import { useState } from 'react';

interface Props {
  onClick: () => void;
}

const NewRequestButton: React.FC<Props> = (props: Props) => {
  // const WebRTCServerEntryForm: React.FC<Props> = (props: Props) => {
  const [run, setRun] = useState(true);
  const steps = [
    {
      target: '.add-workspace-button',
      content:
        'click ‘add to workspace,’ then in the workspace window, click ‘send’ to be able to start communicating with your partner. Type a message in the ‘Response’ window to send it to your partner.',
      placement: 'bottom',
    },
  ];

  return (
    <div>
      <Joyride
        steps={steps}
        run={run}
        continuous
        showSkipButton
        disableOverlayClose={true}
        locale={{
          close: 'Close',
        }}
      />
      <button
        className="button is-normal is-primary-100 add-request-button is-vertical-align-center is-justify-content-center add-workspace-button no-border-please"
        onClick={() => {
          setRun(true); // Start Joyride when clicked
          onClick(); // Call the passed onClick function
        }}
        type="button"
        style={{ margin: '10px' }}
      >
        Add to Workspace
      </button>
    </div>
  );
};
export default NewRequestButton;
