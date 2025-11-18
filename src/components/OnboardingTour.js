// src/components/OnboardingTour.js
import React from 'react';
import { TourProvider, useTour } from '@reactour/tour';

const tourSteps = [
    {
        selector: '.weather-card',
        content: 'This is the main weather card. It shows the current weather, time, and a detailed forecast for your primary location.',
    },
    {
        selector: '.seasonal-sun-path',
        content: "This panel shows the Earth's orbit and explains the cause of the seasons. The animation shows the Earth's yearly progress.",
    },
    {
        selector: '.sidebar-toggle',
        content: 'Click here to expand or collapse the World Clock sidebar.',
    },
    {
        selector: '.settings-button',
        content: 'You can customize almost everything! Click here to open the settings panel.',
    },
];

const TourController = ({ run, onTourEnd }) => {
    const { setIsOpen } = useTour();
    React.useEffect(() => {
        setIsOpen(run);
    }, [run, setIsOpen]);
    return null;
};

/**
 * Provides a guided tour for new users of the application.
 * It wraps the application content and uses a provider to manage the tour's state.
 *
 * @param {object} props - The component's properties.
 * @param {boolean} props.run - A boolean to start or stop the tour.
 * @param {function} props.onTourEnd - A callback function to execute when the tour is finished or skipped.
 * @param {React.ReactNode} props.children - The application components to be rendered within the tour's provider.
 */
function OnboardingTour({ run, onTourEnd, children }) {
    return (
        <TourProvider steps={tourSteps} onRequestClose={onTourEnd}>
            <TourController run={run} onTourEnd={onTourEnd} />
            {children}
        </TourProvider>
    );
}

export default OnboardingTour;