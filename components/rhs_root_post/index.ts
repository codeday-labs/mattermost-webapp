// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {bindActionCreators, Dispatch} from 'redux';

import {showActionsDropdownPulsatingDot} from 'selectors/actions_menu';

import {setActionsMenuInitialisationState} from 'mattermost-redux/actions/preferences';

// @ts-expect-error TS(2307): Cannot find module 'mattermost-redux/selectors/ent... Remove this comment to see the full error message
import {getChannel} from 'mattermost-redux/selectors/entities/channels';

// @ts-expect-error TS(2307): Cannot find module 'mattermost-redux/selectors/ent... Remove this comment to see the full error message
import {getConfig} from 'mattermost-redux/selectors/entities/general';

import {
    get,
    isCollapsedThreadsEnabled,

// @ts-expect-error TS(2307): Cannot find module 'mattermost-redux/selectors/ent... Remove this comment to see the full error message
} from 'mattermost-redux/selectors/entities/preferences';

// @ts-expect-error TS(2307): Cannot find module 'mattermost-redux/selectors/ent... Remove this comment to see the full error message
import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';

// @ts-expect-error TS(2307): Cannot find module 'mattermost-redux/selectors/ent... Remove this comment to see the full error message
import {getUser} from 'mattermost-redux/selectors/entities/users';

// @ts-expect-error TS(2307): Cannot find module 'mattermost-redux/types/actions... Remove this comment to see the full error message
import {GenericAction} from 'mattermost-redux/types/actions';

// @ts-expect-error TS(2307): Cannot find module '@mattermost/types/emojis' or i... Remove this comment to see the full error message
import {Emoji} from '@mattermost/types/emojis';

// @ts-expect-error TS(2307): Cannot find module '@mattermost/types/posts' or it... Remove this comment to see the full error message
import {Post} from '@mattermost/types/posts';

// @ts-expect-error TS(2307): Cannot find module 'actions/post_actions' or its c... Remove this comment to see the full error message
import {markPostAsUnread, emitShortcutReactToLastPostFrom} from 'actions/post_actions';

// @ts-expect-error TS(2307): Cannot find module 'selectors/emojis' or its corre... Remove this comment to see the full error message
import {getShortcutReactToLastPostEmittedFrom, getOneClickReactionEmojis} from 'selectors/emojis';

// @ts-expect-error TS(2307): Cannot find module 'selectors/posts' or its corres... Remove this comment to see the full error message
import {getIsPostBeingEditedInRHS, isEmbedVisible} from 'selectors/posts';

// @ts-expect-error TS(2307): Cannot find module 'selectors/views/browser' or it... Remove this comment to see the full error message
import {getIsMobileView} from 'selectors/views/browser';

// @ts-expect-error TS(2307): Cannot find module 'types/store' or its correspond... Remove this comment to see the full error message
import {GlobalState} from 'types/store';

// @ts-expect-error TS(2307): Cannot find module 'utils/post_utils' or its corre... Remove this comment to see the full error message
import {shouldShowActionsMenu} from 'utils/post_utils';

// @ts-expect-error TS(2307): Cannot find module 'utils/channel_utils' or its co... Remove this comment to see the full error message
import {isArchivedChannel} from 'utils/channel_utils';

// @ts-expect-error TS(2307): Cannot find module 'utils/constants' or its corres... Remove this comment to see the full error message
import {Preferences} from 'utils/constants';

import RhsRootPost from './rhs_root_post';

interface OwnProps {
    post: Post ;
    teamId: string;
}

function mapStateToProps(state: GlobalState, ownProps: OwnProps) {
    const config = getConfig(state);
    const enableEmojiPicker = config.EnableEmojiPicker === 'true';
    const enablePostUsernameOverride = config.EnablePostUsernameOverride === 'true';
    const teamId = ownProps.teamId || getCurrentTeamId(state);
    const channel = getChannel(state, ownProps.post.channel_id);
    const shortcutReactToLastPostEmittedFrom = getShortcutReactToLastPostEmittedFrom(state);

    const user = getUser(state, ownProps.post.user_id);
    const isBot = Boolean(user && user.is_bot);
    const showActionsMenuPulsatingDot = showActionsDropdownPulsatingDot(state);

    let emojis: Emoji[] = [];
    const oneClickReactionsEnabled = get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.ONE_CLICK_REACTIONS_ENABLED, Preferences.ONE_CLICK_REACTIONS_ENABLED_DEFAULT) === 'true';
    if (oneClickReactionsEnabled) {
        emojis = getOneClickReactionEmojis(state);
    }

    return {
        isBot,
        enableEmojiPicker,
        enablePostUsernameOverride,
        isEmbedVisible: isEmbedVisible(state, ownProps.post.id),
        isReadOnly: false,
        teamId,
        pluginPostTypes: state.plugins.postTypes,
        channelIsArchived: isArchivedChannel(channel),
        isFlagged: get(state, Preferences.CATEGORY_FLAGGED_POST, ownProps.post.id, null) != null,
        compactDisplay: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.MESSAGE_DISPLAY, Preferences.MESSAGE_DISPLAY_DEFAULT) === Preferences.MESSAGE_DISPLAY_COMPACT,
        colorizeUsernames: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.COLORIZE_USERNAMES, Preferences.COLORIZE_USERNAMES_DEFAULT) === 'true',
        shortcutReactToLastPostEmittedFrom,
        shouldShowActionsMenu: shouldShowActionsMenu(state, ownProps.post),
        showActionsMenuPulsatingDot,
        collapsedThreadsEnabled: isCollapsedThreadsEnabled(state),
        oneClickReactionsEnabled,
        recentEmojis: emojis,
        isExpanded: state.views.rhs.isSidebarExpanded,

        isPostBeingEdited: getIsPostBeingEditedInRHS(state, ownProps.post.id),
        isMobileView: getIsMobileView(state),
    };
}

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators({
            markPostAsUnread,
            emitShortcutReactToLastPostFrom,
            setActionsMenuInitialisationState,
        }, dispatch),
    };
}

// @ts-expect-error TS(2769): No overload matches this call.
export default connect(mapStateToProps, mapDispatchToProps)(RhsRootPost);
