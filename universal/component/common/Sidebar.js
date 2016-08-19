import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import 'jquery-slimscroll/jquery.slimscroll';
import {
  vodCategories, liveTvCategories, musicCategories
} from '../../../utils/staticData';

export default class Sidebar extends React.Component {
  componentDidMount() {
    $(this.refs.sidebar).slimScroll({
      height: '100%'
    });
  }

  render() {
    const vodSort = 'newRank';
    const liveTvSort = 'hotRank';
    const musicSort = 'newRank';

    return (
      <aside className="sidebar-menu fixed">
        <div className="sidebar-inner scrollable-sidebar" ref="sidebar">
          <div className="main-menu">
            <ul className="accordion">
              <li className="openable bg-palette2">
                <Link to={{pathname: '/vods', query: {sort: vodSort}}} activeClassName="active">
                  <span className="menu-content block">
                    <span className="menu-icon"><i className="block fa fa-video-camera fa-lg" /></span>
                    <span className="text m-left-sm">VOD</span>
                    <span className="submenu-icon" />
                  </span>
                </Link>
                <ul className="submenu">
                  {vodCategories.map(category =>
                    <li key={category.name}>
                      <Link to={{pathname: '/vods', query: {category: category.name, sort: vodSort}}} activeClassName="active">
                        <span className="submenu-label">{category.name}</span>
                      </Link>

                      {category.subCategories &&
                        <ul className="submenu subsub">
                          {category.subCategories.map(subCategory =>
                             <li key={subCategory.name}>
                               <Link to={{pathname: '/vods', query: {category: category.name, category2th: subCategory.name, sort: vodSort}}} activeClassName="active">
                                 <span className="submenu-label">{subCategory.name}</span>
                               </Link>
                            </li>
                          )}
                        </ul>
                      }
                    </li>
                  )}
                </ul>
              </li>
              <li className="openable bg-palette3">
                <Link to={{pathname: '/live-tv', query: {sort: liveTvSort}}} activeClassName="active">
                  <span className="menu-content block">
                    <span className="menu-icon"><i className="block fa fa-desktop fa-lg" /></span>
                    <span className="text m-left-sm">Live TV</span>
                    <span className="submenu-icon" />
                  </span>
                </Link>
                <ul className="submenu">
                  {liveTvCategories.map(category =>
                    <li key={category.name}>
                      <Link to={{pathname: `/live-tv`, query: {category: category.name, sort: liveTvSort}}} activeClassName="active">
                        <span className="submenu-label">{category.name}</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </li>
              <li className="openable bg-palette4">
                <Link to={{pathname: '/music', query: {sort: musicSort}}} activeClassName="active">
                  <span className="menu-content block">
                    <span className="menu-icon"><i className="block fa fa-music fa-lg" /></span>
                    <span className="text m-left-sm">Music</span>
                    <span className="submenu-icon" />
                  </span>
                </Link>
                <ul className="submenu">
                  {musicCategories.map(category =>
                    <li key={category.name}>
                      <Link to={{pathname: '/music', query: {category: category.name, sort: musicSort}}} activeClassName="active">
                        <span className="submenu-label">{category.name}</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </li>
              <li className="openable bg-palette1">
                <Link to="/photo-album" activeClassName="active">
                  <span className="menu-content block">
                    <span className="menu-icon"><i className="fa fa-picture-o" aria-hidden="true" /></span>
                    <span className="text m-left-sm">Photo</span>
                    <span className="submenu-icon" />
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    );
  }
}
