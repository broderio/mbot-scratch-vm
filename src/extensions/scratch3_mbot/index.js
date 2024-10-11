const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const { MBotAPI } = require('./dist/main.js');

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
                        default: 'drive( x: [VX], y: [VY], ω: [WZ] )',
                        description: 'Drive the MBot'
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
                        default: 'stop MBot',
                        description: 'Stop the MBot.'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'detectObstacle',
                    text: formatMessage({
                        id: 'mbot.detectObstacleBlock',
                        default: 'is an obstacle within [DIST] meters at [ANGLE] degrees?',
                        description: 'Checks for an obstacle in the surrounding area'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        DIST: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.5,
                            description: 'Distance in meters to check for obstacles.'
                        },
                        ANGLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                            description: 'Angle in degrees to check for obstacles. 0 is straight ahead, 90 is to the left, 180 is behind, 270 is to the right.'
                        }
                    }
                },
                {
                    opcode: 'angleToNearestObstacle',
                    text: formatMessage({
                        id: 'mbot.angleToNearestObstacle',
                        default: 'Angle to nearest obstacle',
                        description: 'Return the angle to the nearest obstacle.'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                {
                    opcode: 'distanceToNearestObstacle',
                    text: formatMessage({
                        id: 'mbot.distanceToNearestObstacle',
                        default: 'Distance to nearest obstacle',
                        description: 'Return the distance to the nearest obstacle.'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                {
                    opcode: 'resetPosition',
                    text: formatMessage({
                        id: 'mbot.resetPositionBlock',
                        default: 'Reset position',
                        description: 'Reset the position of the MBot.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {}
                },
                {
                    opcode: `getXPosition`,
                    text: formatMessage({
                        id: 'mbot.getXPositionBlock',
                        default: 'X Position',
                        description: 'Get the x position of the MBot in meters.'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                {
                    opcode: `getYPosition`,
                    text: formatMessage({
                        id: 'mbot.getYPositionBlock',
                        default: 'Y Position',
                        description: 'Get the y position of the MBot in meters.'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                {
                    opcode: `getHeading`,
                    text: formatMessage({
                        id: 'mbot.getHeadingBlock',
                        default: 'Heading',
                        description: 'Get the heading of the MBot in degrees.'
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
    
    stop () {
        this.mbot.drive(0, 0, 0);
    }
    
    detectObstacle(args){
        if (this.mbot_scan == null) {
            return false;
        }
        
        var dir = args.ANGLE * DEG_TO_RAD

        if (dir === undefined) {
            return false;
        }

        const dist = args.DIST
        const slice_size = 30 * DEG_TO_RAD

        for (let i = 0; i < this.mbot_scan.data.ranges.length; i++) {
            var range = this.mbot_scan.data.ranges[i]
            var theta = this.mbot_scan.data.thetas[i]
            if (range < dist && range > 0 && Math.abs(theta - dir) < slice_size) {
                return true
            }
        }
        return false
    }
    
    angleToNearestObstacle () {
        if (this.mbot_scan == null) {
            return 0;
        }

        var min_range = 1000
        var min_theta = 0
        for (let i = 0; i < this.mbot_scan.data.ranges.length; i++) {
            var range = this.mbot_scan.data.ranges[i]
            var theta = this.mbot_scan.data.thetas[i]
            if (range < min_range && range > 0) {
                min_range = range
                min_theta = theta
            }
        }
        return min_theta * 180 / Math.PI
    }

    distanceToNearestObstacle () {
        if (this.mbot_scan == null) {
            return 0;
        }

        var min_range = 1000
        for (let i = 0; i < this.mbot_scan.data.ranges.length; i++) {
            var range = this.mbot_scan.data.ranges[i]
            if (range < min_range && range > 0) {
                min_range = range
            }
        }
        return min_range
    }

    resetPosition () {
        this.mbot.publish(MBotAPI.config.RESET_ODOMETRY.channel, { x: 0, y: 0, theta: 0 });
    }

    getXPosition () {
        return this.mbot_odom.data.x;
    }

    getYPosition () {
        return this.mbot_odom.data.y;
    } 

    getHeading () {
        return this.mbot_odom.data.theta * 180 / Math.PI;
    }

    // predictNumber () {
    // }
}


module.exports = Scratch3MBot;
