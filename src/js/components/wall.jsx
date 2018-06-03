
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Surface } from './surface';

export class Wall extends Component {

	static defaultProps = {
	  placement: '',
	  direction: '',
	  surfaces: [],
	  exit: false,
	  objects: []
	}

	static propTypes = {
		exit: PropTypes.bool,
		placement: PropTypes.string,
		surfaces: PropTypes.arrayOf(PropTypes.string)
	}

	constructor(props) {
		super(props);
		
		const req = './wall-' + this.props.placement + '.scss';
		require.context(
			__dirname + '../../../css/components',
			true,
			/\/wall\-.*\.scss/
		)(req);
	}

	render() {
		const classes = this.getClasses();
		this.loadTextures();

		// @todo render objects (e.g. doors) as children

		return (
			<div className={classes}>
				
			</div>
		);
	}

	getClasses() {
		const classArr = ['wall-' + this.props.placement];
		this.props.surfaces.forEach(function(surfaceName) {
			classArr.push(surfaceName);
		});
		return classArr.join(' ');
	}

	loadTextures() {
		// const ctxt = require.context(
		// 	__dirname + '../../../css/textures',
		// 	false,
		// 	/\/texture\-.*\.scss/
		// );
		// this.props.data.get('surface').textures.forEach(function(texture) {
		// 	ctxt('./texture-' + texture + '.scss');
		// });
	}

}

