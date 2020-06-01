import cv2
import numpy as np

cap = None
lastTickCount = 0

def startLive():
    global cap
    cap = cv2.VideoCapture(0)

def finishLive():
    global cap
    cap.release()

def restartLive():
    finishLive()
    cv2.waitKey(500)

    startLive()

def getFrame():
    ret, frame = cap.read()
    if (not ret):
        restartLive()
        return getFrame()
    return frame

def getCounter():
    global lastTickCount
    return (cv2.getTickCount() - lastTickCount) / cv2.getTickFrequency()
    

def resetCounter():
    global lastTickCount
    lastTickCount = cv2.getTickCount()

startLive()
resetCounter()

frame_cam = getFrame()
frame_cam_past = frame_cam

height, width = frame_cam.shape[:2]
padding_bottom = 3 * height // 4


while True:
    frame_cam = getFrame()

    frame_out = np.zeros(frame_cam.shape, dtype=np.uint8)
    frame_out[:padding_bottom, :] = frame_cam[:padding_bottom, :]

    diff = np.subtract(frame_cam, frame_cam_past) / (height * width)
    msr = np.sum((diff ** 2)) ** 1/2

    magic_value = int(min(msr * 10, 1) * 255)

    frame_out[padding_bottom:] = (0,0, magic_value)

    # cv2.imshow('cam', frame_cam)
    cv2.imshow('out', frame_out)

    frame_cam_past = frame_cam

    if getCounter() > 10 * 1000:
    # if getCounter() > 5 * 60 * 1000:
        restartLive()
        resetCounter()
        print('Restarted')

    waitTime = int((270 - msr) * 5)
    if cv2.waitKey(waitTime) == ord('q'): break

cv2.destroyAllWindows()
cap.release()