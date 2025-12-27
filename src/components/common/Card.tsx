import type { HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
    position?: 'fixed' | 'absolute' | 'relative';
}

export function Card({
    position = 'relative',
    className = '',
    children,
    ...props
}: CardProps) {
    const positionClasses = {
        fixed: 'fixed',
        absolute: 'absolute bottom-4 left-4',
        relative: 'relative',
    };

    return (
        <div
            className={`${positionClasses[position]} bg-white p-4 rounded-lg shadow-xl max-w-sm ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}