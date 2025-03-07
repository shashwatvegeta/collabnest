// components/ui/tabs.js
import React, { useState } from 'react';

export function Tabs({ defaultValue, children }) {
    const [activeTab, setActiveTab] = useState(defaultValue);
    return (
        <div>
            {React.Children.map(children, (child, index) => {
                if (child.type.displayName === 'TabsList') {
                    return React.cloneElement(child, { activeTab, setActiveTab, key: `tabs-list-${index}` });
                }
                if (child.type.displayName === 'TabsContent' && child.props.value === activeTab) {
                    return React.cloneElement(child, { key: `tabs-content-${child.props.value}` });
                }
                return null;
            })}
        </div>
    );
}

export function TabsList({ children, activeTab, setActiveTab }) {
    return (
        <div className="flex space-x-4 border-b mb-4">
            {React.Children.map(children, (child, index) =>
                React.cloneElement(child, {
                    isActive: child.props.value === activeTab,
                    onClick: () => setActiveTab(child.props.value),
                    key: `tabs-trigger-${child.props.value}`,
                })
            )}
        </div>
    );
}

export function TabsTrigger({ value, children, isActive, onClick }) {
    return (
        <button
            className={`px-4 py-2 ${
                isActive ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
            }`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export function TabsContent({ children }) {
    return <div>{children}</div>;
}

Tabs.displayName = 'Tabs';
TabsList.displayName = 'TabsList';
TabsTrigger.displayName = 'TabsTrigger';
TabsContent.displayName = 'TabsContent';
