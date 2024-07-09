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
                        default: 'is there obstacle to the robot\'s [DIR]?',
                        description: 'Detect if there is an obstacle in the specified direction relative to the robot.'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        DIR: {
                            type: ArgumentType.STRING,
                            menu: 'direction',
                            defaultValue: 'front'
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
        const speed = args.SPEED
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
        const obj = {
            "cmd": "read_lidar",
            "args": {}
        }
        this.socket.send(JSON.stringify(obj));
        
        msg = this.socket.recv();
        lidar_msg = JSON.parse(msg);
        
        const dir = args.DIR;
        // Return true if there is an obstacle in the specified direction

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
        const obj = {
            "cmd": "read_odometry",
            "args": {}
        }
        this.socket.send(JSON.stringify(obj));

        msg = this.socket.recv();
        odometry_msg = JSON.parse(msg);
        return odometry_msg.x / FT_TO_M;
    }
    getYPosition () {
        const obj = {
            "cmd": "read_odometry",
            "args": {}
        }
        this.socket.send(JSON.stringify(obj));

        msg = this.socket.recv();
        odometry_msg = JSON.parse(msg);
        return odometry_msg.y / FT_TO_M;
    }
        // Same as getXPosition for y;
    
    getDirection () {
        const obj = {
            "cmd": "read_odometry",
            "args": {}
        }
        this.socket.send(JSON.stringify(obj));

        msg = this.socket.recv();
        odometry_msg = JSON.parse(msg);
        return odometry_msg.theta;
        // Same as getXPosition for theta
    }
}


module.exports = Scratch3MBot;