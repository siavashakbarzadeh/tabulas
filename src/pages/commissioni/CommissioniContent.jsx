import React from "react";

/**
 * Displays the content of the currently selected docNode.
 * If it has HTML in docContentStreamContent, we render it.
 * Otherwise, show a placeholder or message.
 */
function CommissioniContent({ node }) {
    if (!node) {
        return <div className="p-4">Select a commission or item from the sidebar</div>;
    }

    // If this node has some docContentStreamContent, display it as HTML
    if (node.docContentStreamContent) {
        return (
            <div className="p-4 bg-gray-100 rounded-md">
                <div
                    className="rich-text-content"
                    dangerouslySetInnerHTML={{ __html: node.docContentStreamContent }}
                />
            </div>
        );
    }

    // If no HTML content, but maybe sub docNodes or other fields, handle accordingly
    return (
        <div className="p-4 text-sm text-gray-700">
            <div className="mb-2 font-semibold">{node.name}</div>
            <p>No HTML content found for this item.</p>
        </div>
    );
}

export default CommissioniContent;
