/* Controllers */

var controllers = angular.module('myApp.controllers', []);

controllers.controller('mainController', ['$scope', '$interval', '$timeout', 'AudioService',
    function($scope, $interval, $timeout, AudioService) {

        $scope.victory = false;

        $scope.pointSound = AudioService.new();
        $scope.pointSound.load('sound/fx/coin1.wav');
        $scope.pointSound.volume(0.3);

        $scope.music = AudioService.new();
        $scope.music.load('sound/music/2.mp3');

        $scope.grid = [];
        $scope.gridBoxSize = 40;
        $scope.gridDimensions = [8, 11];

        $scope.mower = {
            pos: {
                x: 0,
                y: 0,
                xPix: 0,
                yPix: 0
            },
            speed: 300,
            css: {
                left: '0px',
                top: '0px',
            },
            moving: false,
            q: []
        };

        for (var i = 0; i < ($scope.gridDimensions[0] * $scope.gridDimensions[1]); i++) {
            $scope.grid.push({
                x: i % $scope.gridDimensions[0],
                y: Math.floor(i / $scope.gridDimensions[0]),
                isGrass: true,
                isMowed: false,
                css: {
                    transitionDelay: $scope.mower.speed * 0.4 + 'ms'
                }
            });
        }

        $scope.grid[0].isMowed = true;

        $scope.mower.css.transitionDuration = $scope.mower.speed + 'ms';

        $scope.setNewPath = function(x, y) {
            if (!$scope.music.playing)
                $scope.music.play();
            var length = $scope.mower.q.length;
            if (length) {
                if (x != $scope.mower.q[length - 1][0] || y != $scope.mower.q[length - 1][1]) {
                    $scope.mower.q.push([x, y]);
                }
            } else {
                if (x != $scope.mower.pos.x || y != $scope.mower.pos.y) {
                    $scope.mower.q.push([x, y]);
                }
                /* if (x == $scope.mower.pos.x || y == $scope.mower.pos.y)
                    $scope.mower.q.push([x, y]);*/
            }
        };

        $scope.$watch('grid', function(val) {
            var victoryCheck = true;
            angular.forEach(val, function(square) {
                if (!square.isMowed)
                    victoryCheck = false;
            });
            if (victoryCheck) {
                $scope.setNewPath(4, 5);
                $scope.setNewPath(4, 5);
                $scope.victory = true;
            }
        }, true);

        // Position Watcher

        $interval(function(mower) {
            if (!$scope.mower.moving && $scope.mower.q.length) {
                $scope.mower.moving = true;

                var changeX = $scope.mower.q[0][0] - $scope.mower.pos.x;
                var changeY = $scope.mower.q[0][1] - $scope.mower.pos.y;

                var change = changeX ? changeX : changeY;
                var axis = changeX ? 'x' : 'y';
                var positive = false;

                if (change > 0)
                    positive = true;

                change = Math.abs(change);

                var i = change;
                var incrementPos = function() {
                    if ($scope.mower.speed > 100) {
                        $scope.mower.speed -= 3;
                        $scope.mower.css.transitionDuration = $scope.mower.speed + 'ms';
                    }
                    if (positive) {
                        if (axis == 'x') {
                            $scope.mower.pos.xPix += $scope.gridBoxSize;
                            $scope.mower.css.left = $scope.mower.pos.xPix + 'px';
                            $scope.mower.pos.x++;
                        } else {
                            $scope.mower.pos.yPix += $scope.gridBoxSize;
                            $scope.mower.css.top = $scope.mower.pos.yPix + 'px';
                            $scope.mower.pos.y++;
                        }
                    } else {
                        if (axis == 'x') {
                            $scope.mower.pos.xPix -= $scope.gridBoxSize;
                            $scope.mower.css.left = $scope.mower.pos.xPix + 'px';
                            $scope.mower.pos.x--;
                        } else {
                            $scope.mower.pos.yPix -= $scope.gridBoxSize;
                            $scope.mower.css.top = $scope.mower.pos.yPix + 'px';
                            $scope.mower.pos.y--;
                        }
                    }
                    if (!$scope.grid[(($scope.mower.pos.y) * 8 + ($scope.mower.pos.x))].isMowed) {
                        $timeout(function() {
                            $scope.pointSound.seek(0);
                            $scope.pointSound.play();
                        }, $scope.mower.speed);
                    }
                    $scope.grid[(($scope.mower.pos.y) * 8 + ($scope.mower.pos.x))].isMowed = true;
                    i--;
                    if (i) {
                        $timeout(function() {
                            incrementPos();
                        }, $scope.mower.speed);
                    } else {
                        $scope.mower.q.splice(0, 1);
                        $scope.mower.moving = false;
                    }
                };
                if (i)
                    incrementPos();
            }
        }, 10);

    }
]);