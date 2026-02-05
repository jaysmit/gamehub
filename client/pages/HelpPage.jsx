import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Gamepad2, Users, Trophy, HelpCircle, MessageCircle } from '../icons/UIIcons';

function HelpPage({
    theme,
    currentTheme,
    navigateTo
}) {
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        {
            question: 'How do I create a game room?',
            answer: 'Click "Create Room" on the home page, enter a room name and your player name, then share the room code with friends so they can join!'
        },
        {
            question: 'How do I join an existing room?',
            answer: 'Click "Join Room" on the home page and enter the 6-character room code shared by the room creator. You can also scan a QR code if one is provided.'
        },
        {
            question: 'How does the scoring work in Drawing Game?',
            answer: 'When someone guesses correctly, the drawer picks the winner. Both the drawer and guesser earn points. Points start at 100 and increase by 100 for each correct guess within the same turn (100, 200, 300, etc).'
        },
        {
            question: 'What happens if I get disconnected?',
            answer: 'You have a 15-second grace period to reconnect. If you refresh the page or lose connection briefly, you can rejoin the room automatically. Your progress and score are preserved.'
        },
        {
            question: 'How do I change my avatar?',
            answer: 'In the game room lobby, click on your avatar or the "Change" button next to it. You can select from any available character. Some characters need to be unlocked by playing games!'
        },
        {
            question: 'Can I play on mobile?',
            answer: 'Yes! GameHub is fully responsive and works great on mobile devices. For the best drawing experience in Pictionary, try using a tablet or stylus.'
        },
        {
            question: 'How do levels and XP work?',
            answer: 'You earn XP by playing games and winning. Each level requires more XP than the last (Level × 100 XP). Leveling up unlocks new characters and features!'
        },
        {
            question: 'How do I add friends?',
            answer: 'Go to the Friends page and search for players by username. Send them a friend request, and once accepted, you can see when they are online and invite them to games.'
        }
    ];

    const gameGuides = [
        {
            title: 'Drawing Game (Pictionary)',
            icon: '🎨',
            description: 'One player draws while others guess the word!',
            rules: [
                'The drawer gets a secret word and must draw it',
                'Other players type guesses in the chat',
                'The drawer picks winners who guess correctly',
                'Multiple correct guesses can happen per turn',
                'Points increase with each correct guess (100, 200, 300...)',
                'Each player takes a turn as the drawer'
            ]
        }
    ];

    return (
        <div className={`min-h-screen ${theme === 'tron' ? 'bg-black tron-grid' : theme === 'kids' ? 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200' : 'bg-gradient-to-br from-gray-900 via-orange-950 to-black'} p-4 pt-24 pb-8`}>
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigateTo('landing')}
                        className={`${theme === 'tron' ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400' : theme === 'kids' ? 'bg-purple-100 hover:bg-purple-200 text-purple-600' : 'bg-orange-900/40 hover:bg-orange-900/60 text-orange-400'} p-2 rounded-xl transition-all`}
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className={`text-2xl font-black ${currentTheme.text} ${currentTheme.font}`}>
                        {theme === 'tron' ? '> HELP' : 'Help & Support'}
                    </h1>
                </div>

                <div className="space-y-6">
                    {/* Quick Links */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { icon: Gamepad2, label: 'Games', color: theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-500' : 'text-orange-400' },
                            { icon: Users, label: 'Friends', color: theme === 'tron' ? 'text-green-400' : theme === 'kids' ? 'text-pink-500' : 'text-green-400' },
                            { icon: Trophy, label: 'Scoring', color: theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-500' : 'text-yellow-400' },
                            { icon: MessageCircle, label: 'Contact', color: theme === 'tron' ? 'text-purple-400' : theme === 'kids' ? 'text-blue-500' : 'text-purple-400' }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className={`${currentTheme.cardBg} backdrop-blur-xl rounded-2xl p-4 text-center ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'}`}
                            >
                                <item.icon className={`w-8 h-8 mx-auto mb-2 ${item.color}`} />
                                <div className={`text-sm font-bold ${currentTheme.text}`}>{item.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Game Guides */}
                    <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'}`}>
                        <h2 className={`text-xl font-bold ${currentTheme.text} mb-4 ${currentTheme.font}`}>
                            {theme === 'tron' ? '> GAME_GUIDES' : 'How to Play'}
                        </h2>

                        {gameGuides.map((game, idx) => (
                            <div key={idx} className="mb-4 last:mb-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-3xl">{game.icon}</span>
                                    <div>
                                        <h3 className={`font-bold ${currentTheme.text}`}>{game.title}</h3>
                                        <p className={`text-sm ${currentTheme.textSecondary}`}>{game.description}</p>
                                    </div>
                                </div>
                                <ul className="space-y-2 ml-12">
                                    {game.rules.map((rule, rIdx) => (
                                        <li key={rIdx} className={`flex items-start gap-2 text-sm ${currentTheme.textSecondary}`}>
                                            <span className={`${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-500' : 'text-orange-400'}`}>•</span>
                                            {rule}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* FAQ */}
                    <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'}`}>
                        <h2 className={`text-xl font-bold ${currentTheme.text} mb-4 flex items-center gap-2 ${currentTheme.font}`}>
                            <HelpCircle className="w-6 h-6" />
                            {theme === 'tron' ? '> FAQ' : 'Frequently Asked Questions'}
                        </h2>

                        <div className="space-y-3">
                            {faqs.map((faq, idx) => (
                                <div
                                    key={idx}
                                    className={`rounded-xl overflow-hidden ${theme === 'tron' ? 'bg-cyan-500/10 border border-cyan-500/20' : theme === 'kids' ? 'bg-purple-100 border-2 border-purple-200' : 'bg-orange-900/20 border border-orange-700/30'}`}
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full flex items-center justify-between p-4 text-left"
                                    >
                                        <span className={`font-medium ${currentTheme.text}`}>{faq.question}</span>
                                        {openFaq === idx ? (
                                            <ChevronUp className={`w-5 h-5 ${currentTheme.textSecondary}`} />
                                        ) : (
                                            <ChevronDown className={`w-5 h-5 ${currentTheme.textSecondary}`} />
                                        )}
                                    </button>
                                    {openFaq === idx && (
                                        <div className={`px-4 pb-4 ${currentTheme.textSecondary} text-sm`}>
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 text-center ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'}`}>
                        <h2 className={`text-xl font-bold ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                            {theme === 'tron' ? '> NEED_MORE_HELP' : 'Need More Help?'}
                        </h2>
                        <p className={`${currentTheme.textSecondary} mb-4`}>
                            Can't find what you're looking for? Get in touch with us!
                        </p>
                        <button
                            className={`${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} font-bold py-3 px-8 rounded-xl transition-all`}
                        >
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HelpPage;
