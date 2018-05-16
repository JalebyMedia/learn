import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Link, { navigateTo } from 'gatsby-link';

import { makeExpandedBlockSelector, toggleBlock } from '../redux';
import Caret from '../../icons/Caret';

const mapStateToProps = (state, ownProps) => {
  const expandedSelector = makeExpandedBlockSelector(ownProps.blockDashedName);

  return createSelector(expandedSelector, isExpanded => ({ isExpanded }))(
    state
  );
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ toggleBlock }, dispatch);

const propTypes = {
  blockDashedName: PropTypes.string,
  challenges: PropTypes.array,
  isExpanded: PropTypes.bool,
  toggleBlock: PropTypes.func.isRequired
};

export class Block extends PureComponent {
  handleBlockClick = () => {
    const { blockDashedName, challenges, toggleBlock } = this.props;
    const blockPath = challenges[0].fields.slug
      .split('/')
      .slice(0, -1)
      .join('/');
    toggleBlock(blockDashedName);
    return navigateTo(blockPath);
  };

  renderChallenges(challenges) {
    // TODO: Split this into a Challenge Component and add tests
    return challenges.map(challenge => (
      <li className='map-challenge-title' key={challenge.dashedName}>
        <Link to={challenge.fields.slug}>{challenge.title}</Link>
      </li>
    ));
  }

  render() {
    const { challenges, isExpanded } = this.props;
    const { blockName } = challenges[0].fields;
    return (
      <li className={`block ${isExpanded ? 'open' : ''}`}>
        <div className='map-title' onClick={this.handleBlockClick}>
          <Caret />
          <h5>{blockName}</h5>
        </div>
        <ul>{isExpanded ? this.renderChallenges(challenges) : null}</ul>
      </li>
    );
  }
}

Block.displayName = 'Block';
Block.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(Block);
