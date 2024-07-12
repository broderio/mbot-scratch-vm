const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

const menuIconURI = "";
const blockIconURI = "";

const WS_URL = "ws://" + window.location.hostname + ":8765";
const FT_TO_M = 0.3048;
const DEG_TO_RAD = Math.PI / 180;

class Scratch3MBot
{
    robotState = null;

    constructor(runtime)
    {
        this.runtime = runtime;
        this.connectToServer();
    }

    connectToServer() {
        this.socket = new WebSocket(WS_URL);

        // Connection opened
        this.socket.addEventListener('open', (event) => {
            console.log('Server connection opened');
        });
        
        // Connection closed
        this.socket.addEventListener('close', (event) => {
            console.log('Server connection closed: ', event.code);
        });
        
        // Connection error
        this.socket.addEventListener('error', (event) => {
            console.log('WebSocket error: ', event);
            if (event instanceof ErrorEvent) {
                console.log('Error message: ', event.message);
                console.log('Error filename: ', event.filename);
                console.log('Error lineno: ', event.lineno);
                console.log('Error colno: ', event.colno);
            }
        });

        // Listen for messages
        this.socket.addEventListener('message', (event) => {
            this.robotState = JSON.parse(event.data)
        });
    }

    getInfo () {
        return {
            id: 'mbot',
            name: formatMessage({
                id: 'mbot',
                default: 'MBot extension',
                description: 'Name of the MBot extension.'
            }),
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            blocks: [
                {
                    opcode: 'drive',
                    text: formatMessage({
                        id: 'mbot.driveBlock',
                        default: 'drive robot at [SPEED] meters per second',
                        description: 'Move the robot forward at a specified speed.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.25
                        }
                    }
                },
                {
                    opcode: 'turn',
                    text: formatMessage({
                        id: 'mbot.turnBlock',
                        default: 'turn robot [DIR] at [SPEED] degrees per second',
                        description: 'Turn the robot at a specified speed.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIR: {
                            type: ArgumentType.STRING,
                            menu: 'angle',
                            defaultValue: 'left'
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: 'stop',
                    text: formatMessage({
                        id: 'mbot.stopBlock',
                        default: 'stop robot',
                        description: 'Stop the robot.'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'detectObstacle',
                    text: formatMessage({
                        id: 'mbot.detectObstacleBlock',
                        default: 'is there an obstacle within [DIST] meters the robot\'s [DIR]?',
                        description: 'Detect if there is an obstacle in the specified direction relative to the robot.'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        DIST: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.5
                        },
                        DIR: {
                            type: ArgumentType.STRING,
                            menu: 'direction',
                            defaultValue: 'front'
                        }
                    }
                },
                {
                    opcode: 'detectObstacleAdvanced',
                    text: formatMessage({
                        id: 'mbot.detectObstacleBlockAdvanced',
                        default: 'is there an obstacle within [DIST] meters the robot\'s [ANGLE]?',
                        description: 'Detect if there is an obstacle in the specified angle relative to the robot.'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        DIST: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.5
                        },
                        ANGLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: `reconnectRobot`,
                    text: formatMessage({
                        id: 'mbot.reconnectRobotBlock',
                        default: 'reconnect',
                        description: 'Reconnect to the robot.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {}
                },
                {
                    opcode: 'resetPosition',
                    text: formatMessage({
                        id: 'mbot.resetPositionBlock',
                        default: 'reset position',
                        description: 'Reset the position of the robot.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {}
                },
                {
                    opcode: `getXPosition`,
                    text: formatMessage({
                        id: 'mbot.getXPositionBlock',
                        default: 'x position',
                        description: 'Get the x position of the robot.'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                {
                    opcode: `getYPosition`,
                    text: formatMessage({
                        id: 'mbot.getYPositionBlock',
                        default: 'y position',
                        description: 'Get the y position of the robot.'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                {
                    opcode: `getDirection`,
                    text: formatMessage({
                        id: 'mbot.getDirectionBlock',
                        default: 'direction',
                        description: 'Get the direction of the robot.'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                {
                    opcode: `getCamera`,
                    text: formatMessage({
                        id: 'mbot.getCameraBlock',
                        default: 'camera number',
                        description: 'Get the number in view of the camera.'
                    })
                }
            ],
            menus: {
                angle: {
                    acceptReporters: true,
                    items: [
                        {
                            text: formatMessage({
                                id: 'mbot.angleLeft',
                                default: 'left',
                                description: 'Left direction.'
                            }),
                            value: 'left'
                        },
                        {
                            text: formatMessage({
                                id: 'mbot.angleRight',
                                default: 'right',
                                description: 'Right direction.'
                            }),
                            value: 'right'
                        }
                    ]
                },
                direction: {
                    acceptReporters: true,
                    items: [
                        {
                            text: formatMessage({
                                id: 'mbot.dirFront',
                                default: 'front',
                                description: 'Front direction.'
                            }),
                            value: 'front'
                        },
                        {
                            text: formatMessage({
                                id: 'mbot.dirBack',
                                default: 'back',
                                description: 'Back direction.'
                            }),
                            value: 'back'
                        },
                        {
                            text: formatMessage({
                                id: 'mbot.dirLeft',
                                default: 'left',
                                description: 'Left direction.'
                            }),
                            value: 'left'
                        },
                        {
                            text: formatMessage({
                                id: 'mbot.dirRight',
                                default: 'right',
                                description: 'Right direction.'
                            }),
                            value: 'right'
                        }
                    ]
                },
                object: {
                    acceptReporters: true,
                    items: [
                        {
                            text: formatMessage({
                                id: 'mbot.objPerson',
                                default: 'person',
                                description: 'Person object.'
                            }),
                            value: 'person'
                        },
                        {
                            text: formatMessage({
                                id: 'mbot.objDog',
                                default: 'dog',
                                description: 'Dog object.'
                            }),
                            value: 'dog'
                        },
                        {
                            text: formatMessage({
                                id: 'mbot.objCat',
                                default: 'cat',
                                description: 'Cat object.'
                            }),
                            value: 'cat'
                        },
                        {
                            text: formatMessage({
                                id: 'mbot.objCar',
                                default: 'car',
                                description: 'Car object.'
                            }),
                            value: 'car'
                        },
                        {
                            text: formatMessage({
                                id: 'mbot.objBicycle',
                                default: 'bicycle',
                                description: 'Bicycle object.'
                            }),
                            value: 'bicycle'
                        }
                    ]
                }
            }
        };
    }
    drive (args) {
        const speed = args.SPEED * 1.0;
        const obj = {
            "cmd": "drive",
            "args": {
                "vx": speed,
                "vy": 0,
                "wz": 0
            }
        }
        this.socket.send(JSON.stringify(obj));
    }
    turn (args) {
        const dir = args.DIR;
        console.log(typeof(args.SPEED))
        const speed = (dir === 'left') ? args.SPEED * DEG_TO_RAD : -args.SPEED * DEG_TO_RAD;
        const obj = {
            "cmd": "drive",
            "args": {
                "vx": 0,
                "vy": 0,
                "wz": speed
            }
        }
        this.socket.send(JSON.stringify(obj));
    }
    stop () {
        const obj = {
            "cmd": "stop",
            "args": {}
        }
        this.socket.send(JSON.stringify(obj));
    }
    detectObstacle (args) {
        if (this.robotState == null) {
            return false;
        }
        
        var dir = undefined
        switch (args.DIR) {
            case 'right':
                dir = 270 * DEG_TO_RAD
                break
            case 'left':
                dir = 90 * DEG_TO_RAD
                break
            case 'front':
                dir = 0
                break
            case 'back':
                dir = 180 * DEG_TO_RAD
                break
        }

        if (dir === undefined) {
            return false;
        }

        const dist = args.DIST * FT_TO_M
        const slice_size = 30 * DEG_TO_RAD

        for (let i = 0; i < this.robotState.scan.ranges.length; i++) {
            var range = this.robotState.scan.ranges[i]
            var theta = this.robotState.scan.thetas[i]
            if (range < dist && range > 0 && Math.abs(theta - dir) < slice_size) {
                return true
            }
        }
        return false
    }
    detectObstacleAdvanced(args){
        if (this.robotState == null) {
            return false;
        }
        
        var dir = args.ANGLE * DEG_TO_RAD

        if (dir === undefined) {
            return false;
        }

        const dist = args.DIST * FT_TO_M
        const slice_size = 30 * DEG_TO_RAD

        for (let i = 0; i < this.robotState.scan.ranges.length; i++) {
            var range = this.robotState.scan.ranges[i]
            var theta = this.robotState.scan.thetas[i]
            if (range < dist && range > 0 && Math.abs(theta - dir) < slice_size) {
                return true
            }
        }
        return false
    }
    reconnectRobot () {
        this.socket.close();
        this.connectToServer(); 
    }
    resetPosition () {
        const obj = {
            "cmd": "reset_odometry",
            "args": {}
        }
        this.socket.send(JSON.stringify(obj));
    }
    getXPosition () {
        return this.robotState.pose.x;
    }

    getYPosition () {
        return this.robotState.pose.y;
    } 
    getDirection () {
        return this.robotState.pose.theta * 180 / Math.PI;
    }
    getCamera () {
        return //Insert Robot Camera data collection here
    }

}


module.exports = Scratch3MBot;