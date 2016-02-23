package it.eng.spagobi.kpi.metadata;

// Generated 19-feb-2016 16.57.14 by Hibernate Tools 3.6.0

import it.eng.spagobi.commons.metadata.SbiDomains;
import it.eng.spagobi.commons.metadata.SbiHibernateModel;

/**
 * SbiKpiRuleOutput generated by hbm2java
 */
public class SbiKpiRuleOutput extends SbiHibernateModel implements java.io.Serializable {

	private Integer id;
	private int ruleId;
	private int typeId;
	private SbiKpiRule sbiKpiRule;
	private SbiKpiAlias sbiKpiAlias;
	private SbiDomains type;
	private SbiDomains category;
	private Integer categoryId;

	public SbiKpiRuleOutput() {
	}

	/**
	 * @return the id
	 */
	public Integer getId() {
		return id;
	}

	/**
	 * @param id
	 *            the id to set
	 */
	public void setId(Integer id) {
		this.id = id;
	}

	/**
	 * @return the ruleId
	 */
	public int getRuleId() {
		return ruleId;
	}

	/**
	 * @param ruleId
	 *            the ruleId to set
	 */
	public void setRuleId(int ruleId) {
		this.ruleId = ruleId;
	}

	/**
	 * @return the typeId
	 */
	public int getTypeId() {
		return typeId;
	}

	/**
	 * @param typeId
	 *            the typeId to set
	 */
	public void setTypeId(int typeId) {
		this.typeId = typeId;
	}

	/**
	 * @return the sbiKpiAlias
	 */
	public SbiKpiAlias getSbiKpiAlias() {
		return sbiKpiAlias;
	}

	/**
	 * @param sbiKpiAlias
	 *            the sbiKpiAlias to set
	 */
	public void setSbiKpiAlias(SbiKpiAlias sbiKpiAlias) {
		this.sbiKpiAlias = sbiKpiAlias;
	}

	/**
	 * @return the type
	 */
	public SbiDomains getType() {
		return type;
	}

	/**
	 * @param type
	 *            the type to set
	 */
	public void setType(SbiDomains type) {
		this.type = type;
	}

	/**
	 * @return the categoryId
	 */
	public Integer getCategoryId() {
		return categoryId;
	}

	/**
	 * @param categoryId
	 *            the categoryId to set
	 */
	public void setCategoryId(Integer categoryId) {
		this.categoryId = categoryId;
	}

	/**
	 * @return the category
	 */
	public SbiDomains getCategory() {
		return category;
	}

	/**
	 * @param category
	 *            the category to set
	 */
	public void setCategory(SbiDomains category) {
		this.category = category;
	}

	/**
	 * @return the sbiKpiRule
	 */
	public SbiKpiRule getSbiKpiRule() {
		return sbiKpiRule;
	}

	/**
	 * @param sbiKpiRule
	 *            the sbiKpiRule to set
	 */
	public void setSbiKpiRule(SbiKpiRule sbiKpiRule) {
		this.sbiKpiRule = sbiKpiRule;
	}

}
