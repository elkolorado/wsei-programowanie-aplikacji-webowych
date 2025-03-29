import React from 'react';

interface ButtonProps {
    onClick: () => void;
    children?: React.ReactNode;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children = '', className = '' }) => {

    //wrapper for clicks for log or analytics
    const clickWrapper = () => {
        //
        console.log('Button clicked');
        onClick();
    }
    

    return (
        <button onClick={clickWrapper} className={className}>
            {children}
        </button>
    );
};

export default Button;