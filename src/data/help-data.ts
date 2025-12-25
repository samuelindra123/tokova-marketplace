export type HelpArticle = {
    id: string;
    category: string;
    question: string;
    answer: string;
    relatedIds?: string[];
};

export const HELP_DATA: HelpArticle[] = [
    // Account & Security
    {
        id: 'acc-1',
        category: 'Account',
        question: 'How do I create an account?',
        answer: 'To create an account, click the "Register" button in the top right corner. Fill in your email, phone number, and password. You will receive a verification email to activate your account.',
        relatedIds: ['acc-2', 'acc-3']
    },
    {
        id: 'acc-2',
        category: 'Account',
        question: 'I forgot my password, what should I do?',
        answer: 'Click "Login" and then select "Forgot Password?". Enter your registered email address, and we will send you a link to reset your password.',
        relatedIds: ['acc-1']
    },
    {
        id: 'acc-3',
        category: 'Account',
        question: 'How to change my profile picture?',
        answer: 'Go to "My Account" > "Profile". Click on the camera icon on your profile picture to upload a new one.',
        relatedIds: ['acc-1']
    },

    // Orders & Shipping
    {
        id: 'ord-1',
        category: 'Orders',
        question: 'How to track my order?',
        answer: 'You can track your order by going to "My Account" > "Orders". Select the order you want to track and click "Track Order" to see the delivery status.',
        relatedIds: ['ord-2', 'ord-3']
    },
    {
        id: 'ord-2',
        category: 'Orders',
        question: 'Can I cancel my order?',
        answer: 'You can cancel your order if the status is still "Pending" or "Awaiting Payment". Go to "My Orders", select the order, and click "Cancel Order". If the order is already processed, please contact the seller.',
        relatedIds: ['ord-1', 'ret-1']
    },
    {
        id: 'ord-3',
        category: 'Orders',
        question: 'Why is my order taking so long?',
        answer: 'Shipping times vary depending on the seller and shipping method. Check the estimated delivery date in your Order Details. If it has passed the date, please contact our Customer Support.',
        relatedIds: ['ord-1']
    },

    // Payments
    {
        id: 'pay-1',
        category: 'Payment',
        question: 'What payment methods are available?',
        answer: 'We accept various payment methods including Credit/Debit Cards (Visa, Mastercard), Bank Transfer, and E-Wallets (GoPay, OVO, Dana).',
        relatedIds: ['pay-2']
    },
    {
        id: 'pay-2',
        category: 'Payment',
        question: 'Is my payment information secure?',
        answer: 'Yes, Tokova uses state-of-the-art encryption technology to ensure your payment details are kept safe and secure. We do not store your full card details.',
        relatedIds: ['pay-1']
    },

    // Returns & Refunds
    {
        id: 'ret-1',
        category: 'Returns',
        question: 'How to request a refund?',
        answer: 'If you received a damaged or incorrect item, go to "My Orders", select the order, and click "Request Refund/Return". Upload photos of the product and describe the issue.',
        relatedIds: ['ord-2']
    },

    // Selling
    {
        id: 'sell-1',
        category: 'Selling',
        question: 'How to start selling on Tokova?',
        answer: 'Visit our "Seller Center" page (link in footer) and register as a seller. Once verified, you can start uploading products immediately.',
        relatedIds: []
    }
];

export const HELP_CATEGORIES = [
    { id: 'Account', icon: '👤', label: 'Account & Security' },
    { id: 'Orders', icon: '📦', label: 'Orders & Shipping' },
    { id: 'Payment', icon: '💳', label: 'Payments' },
    { id: 'Returns', icon: 'cw', label: 'Returns & Refunds' },
    { id: 'Selling', icon: 'shop', label: 'Selling on Tokova' },
];
