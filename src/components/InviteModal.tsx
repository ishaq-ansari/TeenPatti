import React, { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';

interface InviteModalProps {
  inviteLink: string;
  onClose: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ inviteLink, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Invite Friends</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <p className="mb-4">Share this link with your friends to invite them to your game:</p>
        
        <div className="flex items-center mb-6">
          <input
            type="text"
            value={inviteLink}
            readOnly
            className="flex-grow border rounded-l p-2 bg-gray-50"
          />
          <button
            onClick={copyToClipboard}
            className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;