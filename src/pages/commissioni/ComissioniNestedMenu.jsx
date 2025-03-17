import React, { useState } from "react";

/**
 * Recursively displays docNodes in a nested menu (sidebar).
 * 
 * @param {Array} docNodes - The array of docNodes to display
 * @param {Function} onSelect - Callback invoked when user selects a node
 * @param {Object} activeNode - The currently selected node
 */
function CommissioniNestedMenu({ docNodes, onSelect, activeNode }) {
    if (!docNodes || docNodes.length === 0) {
        return null;
    }

    return (
        <ul className="space-y-1">
            {docNodes.map((node) => (
                <MenuItem
                    key={node.name}
                    node={node}
                    onSelect={onSelect}
                    activeNode={activeNode}
                />
            ))}
        </ul>
    );
}

function MenuItem({ node, onSelect, activeNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = node.docNodes && node.docNodes.length > 0;

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    // Check if this node is the currently active node
    const isActive = activeNode && activeNode.name === node.name;

    return (
        <li>
            {/* Node title row */}
            <div className="flex items-center justify-between bg-white text-gray-800 px-3 py-2 rounded hover:bg-gray-200">
                {/* Clicking the name selects the node (leaf or not). 
            You can decide to only call onSelect if it's a leaf (uiLeaf), 
            but here's a simple approach to always allow selecting. */}
                <button
                    onClick={() => onSelect(node)}
                    className={`text-left flex-1 ${isActive ? "font-semibold text-red-600" : ""
                        }`}
                >
                    {node.name}
                </button>

                {/* If node has children, show a toggle arrow */}
                {hasChildren && (
                    <button onClick={handleToggle} className="ml-2 text-sm text-gray-600">
                        {isOpen ? "▼" : "▶"}
                    </button>
                )}
            </div>

            {/* If there are child docNodes, render them recursively in a sub-list */}
            {hasChildren && isOpen && (
                <div className="ml-4 mt-1 border-l border-gray-300 pl-2">
                    <CommissioniNestedMenu
                        docNodes={node.docNodes}
                        onSelect={onSelect}
                        activeNode={activeNode}
                    />
                </div>
            )}
        </li>
    );
}

export default CommissioniNestedMenu;
