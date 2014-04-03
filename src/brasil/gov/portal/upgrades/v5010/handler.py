# -*- coding:utf-8 -*-

from brasil.gov.portal.config import PROJECTNAME
from Products.CMFCore.utils import getToolByName

import logging

logger = logging.getLogger(PROJECTNAME)


def apply_dependencies(context):
    ''' Atualiza perfil para versao 5010 '''
    plone_view = context.restrictedTraverse('@@plone_portal_state')
    portal = plone_view.portal()
    qi = getToolByName(portal, 'portal_quickinstaller')
    # Instala dependencias
    dependencies = [
        'brasil.gov.agenda',
    ]
    for dep in dependencies:
        if not qi.isProductInstalled(dep):
            qi.installProduct(dep, profile='%s:default' % dep)
    # log info
    logger.info('Atualizado para versao 5010')
