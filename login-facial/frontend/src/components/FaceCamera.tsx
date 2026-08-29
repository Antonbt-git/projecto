import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

interface Props {
    onDetected: (descriptor: number[]) => void;
}

function FaceCamera({ onDetected }: Props) {

    const videoRef = useRef<HTMLVideoElement>(null);

    const [loaded, setLoaded] = useState(false);
    const [message, setMessage] = useState("Cargando modelos...");

    useEffect(() => {

        const loadModels = async () => {

            try {

                await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
                await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
                await faceapi.nets.faceRecognitionNet.loadFromUri("/models");

                setLoaded(true);
                setMessage("✅ Modelos cargados");

            } catch (error) {

                console.error("Error cargando modelos:", error);
                setMessage("❌ No se pudieron cargar los modelos");

            }
        };

        loadModels();

    }, []);

    const startCamera = async () => {

        try {

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: true
                });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            setMessage("📷 Cámara activa. Mira a la cámara.");

        } catch (error) {

            console.error(error);
            setMessage("❌ No se pudo acceder a la cámara");

        }
    };

    const detectFace = async () => {

        if (!videoRef.current || !loaded) {
            setMessage("Espera a que carguen los modelos");
            return;
        }

        try {

            const detection =
                await faceapi
                    .detectSingleFace(
                        videoRef.current,
                        new faceapi.TinyFaceDetectorOptions()
                    )
                    .withFaceLandmarks()
                    .withFaceDescriptor();

            if (!detection) {
                setMessage("❌ No se detectó tu rostro");
                return;
            }

            const descriptor =
                Array.from(detection.descriptor);

            console.log("Descriptor:", descriptor);

            onDetected(descriptor);

            setMessage("✅ Rostro detectado correctamente");

        } catch (error) {

            console.error("Error detectando rostro:", error);
            setMessage("❌ Error detectando rostro");

        }
    };

    return (
        <div className="face-box">

            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
            />

            <button
                type="button"
                onClick={startCamera}
            >
                📷 Activar cámara
            </button>

            <button
                type="button"
                onClick={detectFace}
                disabled={!loaded}
            >
                🔍 Detectar rostro
            </button>

            <span>{message}</span>

        </div>
    );
}

export default FaceCamera;