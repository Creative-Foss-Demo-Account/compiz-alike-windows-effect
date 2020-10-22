'use strict';

const Meta = imports.gi.Meta;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Effects = Me.imports.effects;
const Config = imports.misc.config;

const EFFECT_NAME = 'wobbly-effect';
const MIN_MAX_EFFECT_NAME = 'min-max-wobbly-effect';

const IS_OLD_SHELL_VERSIONS = Config.PACKAGE_VERSION.startsWith("3.36") ||
        Config.PACKAGE_VERSION.startsWith("3.34") ||
        Config.PACKAGE_VERSION.startsWith("3.32") ||
        Config.PACKAGE_VERSION.startsWith("3.30") ||
        Config.PACKAGE_VERSION.startsWith("3.28");

var currentWobblyEffect = null;
var currentMinMaxEffect = null;

var is_old_shell_versions = function () {
    return IS_OLD_SHELL_VERSIONS;
}

var is_managed_op = function (op) {
    return Meta.GrabOp.MOVING == op ||
           Meta.GrabOp.RESIZING_W == op ||
           Meta.GrabOp.RESIZING_E == op ||
           Meta.GrabOp.RESIZING_S == op ||
           Meta.GrabOp.RESIZING_N == op ||
           Meta.GrabOp.RESIZING_NW == op ||
           Meta.GrabOp.RESIZING_NE == op ||
           Meta.GrabOp.RESIZING_SE == op ||
           Meta.GrabOp.RESIZING_SW == op;
}

var get_actor = function(window) {
    if (window) {
        return window.get_compositor_private();
    }
    return null;
}

var has_wobbly_effect = function (actor) {
    return actor && actor.get_effect(EFFECT_NAME);
}

var add_actor_wobbly_effect = function (actor, op) { 
    if (actor) {
        if (Meta.GrabOp.MOVING == op) {
            actor.add_effect_with_name(EFFECT_NAME, new Effects.WobblyEffect({op: op}));
            currentWobblyEffect = actor.get_effect(EFFECT_NAME);
        } else {
            actor.add_effect_with_name(EFFECT_NAME, new Effects.ResizeEffect({op: op}));
            currentWobblyEffect = actor.get_effect(EFFECT_NAME);
        }
    }
}

var add_actor_min_max_effect = function (actor, op) { 
    if (actor) {
        actor.add_effect_with_name(MIN_MAX_EFFECT_NAME, new Effects.MinimizeMaximizeEffect({op: op}));
        currentMinMaxEffect = actor.get_effect(MIN_MAX_EFFECT_NAME);
    }
}

var stop_actor_wobbly_effect = function (actor) {
    if (actor) {
        let effect = actor.get_effect(EFFECT_NAME);
        if (effect) {
            effect.stop(actor);
        }
    }
}

var destroy_actor_wobbly_effect = function (actor) {
    if (actor) {
        let effect = actor.get_effect(EFFECT_NAME);
        if (effect) {
            effect.destroy();
        }
    }

    if (currentWobblyEffect) {
        currentWobblyEffect.destroy();
    }
    currentWobblyEffect = null;
}

var destroy_actor_min_max_effect = function (actor) {
    if (actor) {
        let effect = actor.get_effect(MIN_MAX_EFFECT_NAME);
        if (effect) {
            effect.destroy();
        }
    }

    if (currentMinMaxEffect) {
        currentMinMaxEffect.destroy();
    }
    currentMinMaxEffect = null;
}