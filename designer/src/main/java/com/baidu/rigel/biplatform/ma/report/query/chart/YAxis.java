/**
 * Copyright (c) 2014 Baidu, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.baidu.rigel.biplatform.ma.report.query.chart;

import java.io.Serializable;

/**
 * YAxis
 * @author peizhongyi01
 *
 */
public class YAxis implements Serializable {
    /**
     * serialize id
     */
    private static final long serialVersionUID = -6722995368788713649L;
    
    /**
     * name
     */
    private String name;
    
    /**
     * unitName
     */
    private String unitName;
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getUnitName() {
        return unitName;
    }
    
    public void setUnitName(String unitName) {
        this.unitName = unitName;
    }
    
}