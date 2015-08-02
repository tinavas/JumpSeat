#!/usr/bin/env bash

arr=('app-form' 'apps' 'blacklist-form' 'blacklist' 'feature-form' 'guide-form' 'iappstep-form' 'modal' 'page-form' 'pagedata-form' 'pathway-form' 'pathwaymap-form' 'pathwaymaps' 'pathways' 'role-form' 'rolemap-form' 'rolepath-form' 'roles' 'roleusermap-form' 'sidebar-guide-admin' 'sidebar-guide-tools' 'sidebar-guides' 'sidebar-step-admin' 'sidebar-step-tools' 'sidebar-steps' 'user-form')
for i in "${arr[@]}";
    do htmlmin -o $i".min.html" $i".html";
done

echo "Total Files Minified: " ${#arr[@]}

#htmlmin -o .min.html .html


