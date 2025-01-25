import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import explodeImg from '../assets/memojis/explode.png'
import swearImg from '../assets/memojis/swear.png'
import bullImg from '../assets/memojis/bull.png'
import confusedImg from '../assets/memojis/confused.png'
import starsImg from '../assets/memojis/stars.png'
import confettiImg from '../assets/memojis/confetti.png'
import blindImg from '../assets/memojis/blind.png'
import thinkImg from '../assets/memojis/think.png'
import towerImg from '../assets/memojis/tower.png'
import handTowerImg from '../assets/memojis/hand-tower.png'
import flagImg from '../assets/memojis/flag.png'
import croissantImg from '../assets/memojis/croissant.png'
import baguetteImg from '../assets/memojis/baguette.png'
import artistImg from '../assets/memojis/artist.png'

const questions = [
    {
        image: thinkImg,
        question: "Un melo costa 40, un limone 60 e una felce 10. Quanto costa una sequoia?",
        answer: ["100", "cento"]
    },
    {
        image: blindImg,
        question: "Hai 9 palline di cui una leggermente piu' pesante delle altre. " +
            "Hai una bilancia a due braccia. " +
            "Quale e' il numero minimo di pesate con cui puoi trovare la pallina piu' pesante?",
        answer: ["2", "due"]
    },
    {
        image: thinkImg,
        question: "161 061 681 881 *** 981 281",
        answer: ["187", "781"]
    },
    {
        image: blindImg,
        question: "Dove andiamo in vacanza quando torni?",
        answer: ["parigi", "paris"]
    }
]

const fireConfetti = () => {
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
            clearInterval(interval)
            return
        }

        const particleCount = 100 * (timeLeft / duration)

        // Center explosion
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.4, 0.6), y: randomInRange(0.4, 0.6) }
        }))

        // Corner explosions
        confetti(Object.assign({}, defaults, {
            particleCount: particleCount / 2,
            origin: { x: randomInRange(0, 0.2), y: randomInRange(0, 0.2) }
        }))
        confetti(Object.assign({}, defaults, {
            particleCount: particleCount / 2,
            origin: { x: randomInRange(0.8, 1), y: randomInRange(0, 0.2) }
        }))
        confetti(Object.assign({}, defaults, {
            particleCount: particleCount / 4,
            origin: { x: randomInRange(0, 0.2), y: randomInRange(0.8, 1) }
        }))
        confetti(Object.assign({}, defaults, {
            particleCount: particleCount / 4,
            origin: { x: randomInRange(0.8, 1), y: randomInRange(0.8, 1) }
        }))

    }, 250)
}

const RotatingCard = ({ value }: { value: string }) => (
    <motion.div
        key={value}
        initial={{ rotateX: -90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        exit={{ rotateX: 90, opacity: 0 }}
        transition={{
            rotateX: { duration: 0.8, ease: "easeInOut" },
            opacity: { duration: 0.4 }
        }}
        className="bg-white bg-opacity-80 text-black rounded-lg w-12 h-16 flex items-center justify-center text-2xl font-bold shadow-lg mx-1"
    >
        {value}
    </motion.div>
)

const Colon = () => (
    <div className="text-2xl font-bold mx-2">:</div> // Increased horizontal margin
)

const getRandomImage = () => {
    const images = [explodeImg, swearImg, bullImg, confusedImg]
    const randomIndex = Math.floor(Math.random() * images.length)
    return images[randomIndex]
}

const getRandomSuccessImage = () => {
    return Math.random() < 0.5 ? starsImg : confettiImg
}

const SuccessConfetti = ({ image, isFinale = false }: { image: string, isFinale?: boolean }) => {
    const triggerPoints = isFinale ? [
        { x: 50, y: 80 },    // center bottom
        { x: 25, y: 80 },    // left bottom
        { x: 75, y: 80 },    // right bottom
        { x: 15, y: 80 },    // far left bottom
        { x: 85, y: 80 },    // far right bottom
    ] : [
        { x: 50, y: 50 },    // center
        { x: 25, y: 60 },    // left
        { x: 75, y: 60 },    // right
        { x: 15, y: 40 },    // far left top
        { x: 20, y: 70 },    // far left bottom
    ]
    
    const getFinalImage = () => {
        const rand = Math.random()
        if (rand < 0.25) return flagImg
        if (rand < 0.5) return croissantImg
        if (rand < 0.75) return baguetteImg
        return artistImg
    }
    
    const particles = triggerPoints.flatMap((trigger, triggerIndex) => 
        Array.from({ length: isFinale ? 20 : 30 }).map((_, i) => ({
            id: `${triggerIndex}-${i}`,
            startX: trigger.x,
            startY: trigger.y,
            endX: Math.random() * 140 - 20,  // Adjusted for better spread
            endY: Math.random() * 100 - 20,  // Adjusted to move upward
            scale: isFinale ? Math.random() * 0.8 + 0.2 : Math.random() * 1.2 + 0.3,
            rotation: Math.random() * 720 - 360,
            size: isFinale ? 
                  (Math.random() < 0.2 ? 'medium' : 'small') :
                  (Math.random() < 0.1 ? 'xl' : 
                   Math.random() < 0.25 ? 'large' : 
                   Math.random() < 0.5 ? 'medium' : 
                   'small'),
            speed: isFinale ?
                   (Math.random() < 0.5 ? 'medium' : 'slow') :
                   (Math.random() < 0.3 ? 'fast' : 
                    Math.random() < 0.6 ? 'medium' : 
                    'slow'),
            image: isFinale ? 
                   getFinalImage() : 
                   image
        }))
    )

    const getDuration = (speed: string) => {
        switch(speed) {
            case 'fast': return Math.random() * 0.5 + 1.5; // 1-1.5s
            case 'medium': return Math.random() * 0.5 + 2.5; // 1.8-2.3s
            case 'slow': return Math.random() * 0.5 + 5; // 2.5-3s
            default: return 2;
        }
    }

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {particles.map(particle => (
                <motion.img
                    key={particle.id}
                    src={particle.image}
                    alt="Success"
                    className={`absolute ${
                        particle.size === 'xl'
                            ? 'w-32 h-32 sm:w-48 sm:h-48'
                            : particle.size === 'large' 
                                ? 'w-24 h-24 sm:w-32 sm:h-32' 
                                : particle.size === 'medium'
                                    ? 'w-16 h-16 sm:w-24 sm:h-24'
                                    : 'w-12 h-12 sm:w-16 sm:h-16'
                    }`}
                    style={{
                        left: `${particle.startX}%`,
                        top: `${particle.startY}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                    initial={{
                        x: 0,
                        y: 0,
                        scale: 0,
                        rotate: 0,
                        opacity: 0
                    }}
                    animate={{
                        x: `${particle.endX - particle.startX}vw`,
                        y: `${particle.endY - particle.startY}vh`,
                        scale: particle.scale,
                        rotate: particle.rotation,
                        opacity: [0, 1, 1, 0]
                    }}
                    transition={{
                        duration: getDuration(particle.speed),
                        ease: "easeOut",
                        times: [0, 0.2, 0.8, 1]
                    }}
                />
            ))}
        </div>
    )
}

export default function Birthy() {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [userAnswer, setUserAnswer] = useState('')
    const [isWrongAnswer, setIsWrongAnswer] = useState(false)
    const [showCheckMark, setShowCheckMark] = useState(false)
    const [showFinal, setShowFinal] = useState(false)
    const [isBlocked, setIsBlocked] = useState(false)
    const [blockTimer, setBlockTimer] = useState(() => {
        const savedTime = localStorage.getItem('blockTimer')
        return savedTime ? parseInt(savedTime, 10) : 0
    })
    const [blockedImage, setBlockedImage] = useState<string | null>(null)
    const [successImage, setSuccessImage] = useState<string | null>(null)
    const [currentDisplayImage, setCurrentDisplayImage] = useState<string | null>(null)

    useEffect(() => {
        if (showFinal) {
            setSuccessImage(towerImg)
            setShowCheckMark(true)
        }
    }, [showFinal])

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (blockTimer > 0) {
            setIsBlocked(true)
            interval = setInterval(() => {
                setBlockTimer((prevTimer) => {
                    const newTimer = prevTimer - 1
                    localStorage.setItem('blockTimer', newTimer.toString())
                    return newTimer
                })
            }, 1000)
        } else {
            setIsBlocked(false)
            setBlockedImage(null)
            setCurrentDisplayImage(null)
            localStorage.removeItem('blockTimer')
        }
        return () => clearInterval(interval)
    }, [blockTimer])

    const formatTime = (seconds: number): string[] => {
        const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
        const remainingSeconds = (seconds % 60).toString().padStart(2, '0')
        return [...minutes.split(''), ...remainingSeconds.split('')]
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isBlocked) return

        const normalizedUserAnswer = userAnswer.toLowerCase().trim()
        const isCorrect = questions[currentQuestion].answer
            .map(ans => ans.toLowerCase().trim())
            .includes(normalizedUserAnswer)

        if (isCorrect) {
            const successImg = getRandomSuccessImage()
            setSuccessImage(successImg)
            setCurrentDisplayImage(successImg)
            setShowCheckMark(true)
            setIsWrongAnswer(false)
            setTimeout(() => {
                setShowCheckMark(false)
                setSuccessImage(null)
                setCurrentDisplayImage(null)
                if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1)
                    setUserAnswer('')
                } else {
                    setShowFinal(true)
                }
            }, 1500)
        } else {
            setIsWrongAnswer(true)
            setShowCheckMark(false)
            setIsBlocked(true)
            setBlockedImage(getRandomImage())
            const newBlockTime = 3599 // 59:59 in seconds
            setBlockTimer(newBlockTime)
            localStorage.setItem('blockTimer', newBlockTime.toString())
            setTimeout(() => setIsWrongAnswer(false), 1000)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-red-400 flex flex-col items-center justify-center p-4 text-white">
            <div className="w-full fixed top-0 left-0 p-4">
                <motion.div
                    className="w-full h-2 bg-white bg-opacity-20 rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="h-full bg-white rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </motion.div>
            </div>

            <div className="w-full max-w-md">
                <div className="h-[88px]">
                    <AnimatePresence>
                        {!isBlocked && !showFinal && (
                            <motion.h1
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-4xl font-bold text-center text-white shadow-text"
                            >
                                A Special Birthday Surprise!
                            </motion.h1>
                        )}
                    </AnimatePresence>
                </div>
                <AnimatePresence mode="wait">
                    {!showFinal ? (
                        <motion.div
                            key={currentQuestion}
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            <div className="perspective-[1000px] w-48 h-48 mx-auto">
                                <motion.div
                                    className="w-full h-full relative preserve-3d"
                                    animate={{ 
                                        rotateY: currentDisplayImage || blockedImage ? 180 : 0 
                                    }}
                                    transition={{ 
                                        duration: 0.8,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <motion.img
                                        src={questions[currentQuestion].image}
                                        alt="Question Image"
                                        className="w-48 h-48 object-contain absolute backface-hidden drop-shadow-[0_4px_3px_rgb(0,0,0,0.3)]"
                                    />
                                    <motion.img
                                        src={currentDisplayImage || blockedImage || questions[currentQuestion].image}
                                        alt="Success Image"
                                        className="w-48 h-48 object-contain absolute backface-hidden rotate-y-180 drop-shadow-[0_4px_3px_rgb(0,0,0,0.3)]"
                                    />
                                </motion.div>
                            </div>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xl text-center font-semibold shadow-text"
                            >
                                {questions[currentQuestion].question}
                            </motion.p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <motion.div
                                    animate={isWrongAnswer ? {
                                        x: [-14, 14, -8, 8, -6, 6, -4, 4, -2, 2, 0],
                                        transition: { duration: 0.8 }
                                    } : {}}
                                >
                                    <input
                                        type="text"
                                        value={userAnswer}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                        className={`w-full p-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 ${
                                            isWrongAnswer 
                                            ? 'focus:ring-red-400 border-2 border-red-400 bg-red-200 bg-opacity-20' 
                                            : 'focus:ring-white border-2 border-transparent'
                                        }`}
                                        placeholder="Your answer..."
                                        disabled={isBlocked}
                                    />
                                </motion.div>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: isBlocked ? 1 : 1.05 }}
                                    whileTap={{ scale: isBlocked ? 1 : 0.95 }}
                                    className={`w-full bg-white bg-opacity-20 text-white py-3 rounded-lg transition duration-300 font-semibold shadow-md ${
                                        isBlocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-30'
                                    }`}
                                    disabled={isBlocked}
                                >
                                    {isBlocked ? `Wait ${blockTimer}s` : 'Submit'}
                                </motion.button>
                            </form>
                        </motion.div>
                    ) : (
                        <>
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6 text-center"
                            >
                                <h2 className="text-3xl font-bold shadow-text">Congratulations! 🎉</h2>
                                <p className="text-xl shadow-text">You've unlocked your special 30th birthday gift!</p>
                                <motion.img
                                    src={handTowerImg}
                                    alt="Birthday Gift"
                                    className="w-64 h-64 sm:w-96 sm:h-96 object-contain mx-auto"
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.div>
                            <SuccessConfetti image={towerImg} isFinale={true} />
                        </>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {showFinal && (
                    <>
                        <motion.div>
                            {/* ... existing final success content ... */}
                        </motion.div>
                    </>
                )}
                {showCheckMark && !showFinal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <SuccessConfetti image={successImage || getRandomSuccessImage()} isFinale={false} />
                    </motion.div>
                )}
                {isBlocked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-0 left-0 right-0 flex items-start justify-center z-50 pt-8"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-8 flex flex-col items-center"
                        >
                            <p className="text-2xl font-bold mb-2">Oops! Wrong answer</p>
                            <p className="text-lg mb-4">Try again in</p>
                            <div className="flex items-center">
                                <AnimatePresence mode="popLayout">
                                    {formatTime(blockTimer).map((digit, index) => (
                                        <React.Fragment key={`digit-${index}`}>
                                            <RotatingCard value={digit} />
                                            {index === 1 && <Colon />}
                                        </React.Fragment>
                                    ))}
                                </AnimatePresence>
                            </div>
                            <div className="flex justify-between w-full mt-2 text-sm">
                                <span className="w-24 text-center">Minutes</span>
                                <span className="w-24 text-center">Seconds</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
