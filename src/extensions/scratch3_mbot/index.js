const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const MBotAPI = require('mbot_js/dist/main.js');

const menuIconURI = "";
const blockIconURI = "";

const mbotIP = window.location.host.split(":")[0];

const FT_TO_M = 0.3048;
const DEG_TO_RAD = Math.PI / 180;

class Scratch3MBot
{
    mbot;
    mbot_odom;
    mbot_scan;

    constructor(runtime)
    {
        this.runtime = runtime;
        this.connectToServer();
    }

    connectToServer() {
        this.mbot = new MBotAPI.MBot(mbotIP);
        this.mbot.readHostname().then((hostname) => { console.log("hostname:", hostname); });
        this.mbot.readChannels().then((chs) => { console.log("chs:", chs); });
        this.mbot.drive(0, 0, 0);

        this.mbot.subscribe(MBotAPI.config.ODOMETRY.channel, (odom) => { this.mbot_odom = odom; });
        this.mbot.subscribe(MBotAPI.config.LIDAR.channel, (scan) => { this.mbot_scan = scan; });
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
                        default: 'drive(vx: [VX], vy: [VY], wz: [WZ])',
                        description: 'Drive the robot'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.0
                        },
                        VY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.0
                        },
                        WZ: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.0
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
                // {
                //     opcode: 'detectObstacle',
                //     text: formatMessage({
                //         id: 'mbot.detectObstacleBlock',
                //         default: 'is there an obstacle within [DIST] meters the robot\'s [DIR]?',
                //         description: 'Detect if there is an obstacle in the specified direction relative to the robot.'
                //     }),
                //     blockType: BlockType.BOOLEAN,
                //     arguments: {
                //         DIST: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 0.0
                //         },
                //         DIR: {
                //             type: ArgumentType.STRING,
                //             menu: 'direction',
                //             defaultValue: 'front'
                //         }
                //     }
                // },
                {
                    opcode: 'detectObstacle',
                    text: formatMessage({
                        id: 'mbot.detectObstacleBlock',
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
                    opcode: `getHeading`,
                    text: formatMessage({
                        id: 'mbot.getHeadingBlock',
                        default: 'heading',
                        description: 'Get the heading of the robot.'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                // {
                //     opcode: `predictNumber`,
                //     text: formatMessage({
                //         id: 'mbot.predictNumberBlock',
                //         default: 'number from image',
                //         description: 'Get the number in view of the camera.'
                //     })
                // }
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
                }
            }
        };
    }
    drive (args) {
        const vx = args.VX * 1.0;
        const vy = args.VY * 1.0;
        const wz = args.WZ * DEG_TO_RAD;
        this.mbot.drive(vx, vy, wz);
    }
    // turn (args) {
    //     const dir = args.DIR;
    //     console.log(typeof(args.SPEED))
    //     const speed = (dir === 'left') ? args.SPEED * DEG_TO_RAD : -args.SPEED * DEG_TO_RAD;
    //     const obj = {
    //         "cmd": "drive",
    //         "args": {
    //             "vx": 0,
    //             "vy": 0,
    //             "wz": -speed
    //         }
    //     }
    //     this.socket.send(JSON.stringify(obj));
    // }
    stop () {
        const obj = {
            "cmd": "stop",
            "args": {}
        }
        this.socket.send(JSON.stringify(obj));
    }
    // detectObstacle (args) {
    //     if (this.robotState == null) {
    //         return false;
    //     }
        
    //     var dir = undefined
    //     switch (args.DIR) {
    //         case 'right':
    //             dir = 270 * DEG_TO_RAD
    //             break
    //         case 'left':
    //             dir = 90 * DEG_TO_RAD
    //             break
    //         case 'front':
    //             dir = 0
    //             break
    //         case 'back':
    //             dir = 180 * DEG_TO_RAD
    //             break
    //     }

    //     if (dir === undefined) {
    //         return false;
    //     }

    //     const dist = args.DIST
    //     const slice_size = 30 * DEG_TO_RAD

    //     for (let i = 0; i < this.robotState.scan.ranges.length; i++) {
    //         var range = this.robotState.scan.ranges[i]
    //         var theta = this.robotState.scan.thetas[i]
    //         if (range < dist && range > 0 && Math.abs(theta - dir) < slice_size) {
    //             return true
    //         }
    //     }
    //     return false
    // }
    detectObstacle(args){
        if (this.robotState == null) {
            return false;
        }
        
        var dir = args.ANGLE * DEG_TO_RAD

        if (dir === undefined) {
            return false;
        }

        const dist = args.DIST
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
        this.mbot.publish(MBotAPI.config.RESET_ODOMETRY.channel, { x: 0, y: 0, theta: 0 });
    }
    getXPosition () {
        return this.mbot_odom.x;
    }

    getYPosition () {
        return this.mbot_odom.y;
    } 
    getDirection () {
        return this.mbot_odom.theta * 180 / Math.PI;
    }
    // predictNumber () {
    //     return this.robotState.prediction
    // }

}


module.exports = Scratch3MBot;
